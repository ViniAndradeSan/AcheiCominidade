import { $, build } from "bun";

await $`rm -rf dist`;

const optionalRequirePackages = [
	"class-transformer",
	"class-validator",
	"@nestjs/microservices",
	"@nestjs/websockets",
	"@fastify/static",
];

const result = await build({
	entrypoints: ["./src/main.ts"],
	outdir: "./dist",
	target: "bun",
	minify: {
		syntax: true,
		whitespace: true,
	},
	// Keep all npm packages external instead of inlining them. Some deps
	// (e.g. `libsql`, used by @prisma/adapter-libsql) resolve their native
	// binary via a runtime `require(`@libsql/${platform}`)` call that only
	// works when the package's real node_modules location is reachable —
	// bundling it breaks that resolution. node_modules must ship alongside
	// dist/ at runtime (see Dockerfile).
	packages: "external",
	external: optionalRequirePackages.filter((pkg) => {
		try {
			require(pkg);
			return false;
		} catch (_) {
			return true;
		}
	}),
	splitting: true,
});

if (!result.success) {
	console.log(result.logs[0]);
	process.exit(1);
}

console.log("Built successfully!");
