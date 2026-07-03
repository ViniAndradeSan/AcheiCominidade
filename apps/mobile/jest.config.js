/** @type {import('jest').Config} */
module.exports = {
	preset: "jest-expo",
	setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
	resolver: "<rootDir>/jest.resolver.js",
	moduleNameMapper: {
		// Must precede the "@/" alias so that `@/global.css` maps to the CSS
		// stub instead of the real stylesheet (first matching pattern wins).
		"\\.(css)$": "<rootDir>/jest.css-mock.js",
		// Mirror tsconfig paths: "@/assets/*" resolves to the project-root
		// assets dir and must precede the general "@/*" -> src mapping.
		"^@/assets/(.*)$": "<rootDir>/assets/$1",
		"^@/(.*)$": "<rootDir>/src/$1",
	},
	transformIgnorePatterns: [
		"node_modules/(?!(.bun|(jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg|expo-router|react-native-reanimated|react-native-worklets|react-native-gesture-handler|react-native-safe-area-context|react-native-screens|standard-navigation))",
	],
	testPathIgnorePatterns: ["/node_modules/", "/e2e/", "/ios/", "/android/"],
};
