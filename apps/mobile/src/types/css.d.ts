// Ambient module declarations for CSS imports used by the web build.
// Metro/webpack handle these at bundle time; TypeScript needs to be told
// their shape so `import` statements type-check.

declare module "*.module.css" {
	const classes: { readonly [className: string]: string };
	export default classes;
}

declare module "*.css";
