const path = require("node:path");

/**
 * Custom Jest resolver.
 *
 * 1. Enforces the web implementation of `react-native-worklets` (per the
 *    Worklets "testing with jest" guide) by dropping `*native*` extensions,
 *    which avoids the native `loadUnpackers` crash from Reanimated 4.
 * 2. Collapses Bun's isolated-install duplicates to a single canonical copy.
 *    Bun creates one physical copy of each package per unique peer-dependency
 *    set (e.g. 7 copies of `expo`, 5 of `expo-modules-core`). Jest's module
 *    registry and `jest-expo`'s path-based mocks (winter runtime, native
 *    modules, messageSocket) only work when every importer resolves to the
 *    same physical file, so bare imports of the packages below are forced to
 *    resolve from the project root.
 */

const PROJECT_ROOT = __dirname;

const DEDUPE = new Set([
	"react",
	"react-dom",
	"react-is",
	"scheduler",
	"react-native",
	"react-test-renderer",
	"expo",
	"expo-modules-core",
	"react-native-reanimated",
	"react-native-worklets",
	"react-native-safe-area-context",
]);

function packageNameOf(request) {
	if (request.startsWith(".") || path.isAbsolute(request)) {
		return null;
	}
	const segments = request.split("/");
	return request.startsWith("@")
		? `${segments[0]}/${segments[1]}`
		: segments[0];
}

/** @type {import('jest-resolve').SyncResolver} */
module.exports = (request, options) => {
	let resolveOptions = options;

	// Force the web build of react-native-worklets to avoid native mocks.
	if (
		options.basedir.includes("react-native-worklets") ||
		request.includes("react-native-worklets")
	) {
		resolveOptions = {
			...resolveOptions,
			extensions: resolveOptions.extensions?.filter(
				(ext) => !ext.includes("native"),
			),
		};
	}

	const pkg = packageNameOf(request);
	if (pkg && DEDUPE.has(pkg)) {
		try {
			return resolveOptions.defaultResolver(request, {
				...resolveOptions,
				basedir: PROJECT_ROOT,
			});
		} catch {
			// Fall back to the original basedir if the canonical copy is
			// not resolvable from the project root.
		}
	}

	return resolveOptions.defaultResolver(request, resolveOptions);
};
