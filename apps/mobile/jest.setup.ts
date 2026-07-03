// Configure Reanimated 4's testing environment. Combined with the
// `react-native-worklets/jest/resolver` (wired up in jest.resolver.js), this
// makes animated components (e.g. the Collapsible's FadeIn view) render
// synchronously without the native worklets runtime.
require("react-native-reanimated").setUpTests();

// Expo installs `global.fetch` as a lazy getter that pulls in
// `expo-modules-core` (and its native JSI logger) on first access. In the Jest
// runtime that native module isn't available, and it hard-crashes whenever a
// test replaces `react-native` (breaking `Platform.select`). Unit tests don't
// exercise `expo/fetch`, so stub the winter fetch module out entirely.
jest.mock("expo/src/winter/fetch", () => ({
	fetch: jest.fn(),
}));

// Provide deterministic safe-area insets/frame so screens using
// useSafeAreaInsets / SafeAreaView render without a native provider.
jest.mock(
	"react-native-safe-area-context",
	() => require("react-native-safe-area-context/jest/mock").default,
);
