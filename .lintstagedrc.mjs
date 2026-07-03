import path from "node:path";

// Each app (apps/mobile, apps/server) owns its own root `biome.json`.
// Biome refuses to run across both at once from the repo root ("nested root
// configuration" error), so we mirror CI (.github/workflows/ci.yml) and
// invoke Biome with each app as its cwd, scoped to only its staged files.
function biomeFor(appDir) {
	return (files) => {
		const relativeFiles = files.map((file) => path.relative(path.join(process.cwd(), appDir), file));
		return `bash -c "cd ${appDir} && bunx biome check --write --no-errors-on-unmatched --files-ignore-unknown=true ${relativeFiles.map((f) => `'${f}'`).join(" ")}"`;
	};
}

export default {
	"apps/mobile/**/*.{js,jsx,ts,tsx,json,jsonc}": biomeFor("apps/mobile"),
	"apps/server/**/*.{js,jsx,ts,tsx,json,jsonc}": biomeFor("apps/server"),
};
