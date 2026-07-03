/// <reference types="detox" />

// End-to-end smoke flow. Detox drives the app on a native simulator/emulator,
// so the native tab bar items (rendered by the OS via expo-router's
// unstable-native-tabs) are matched by their visible labels, while the
// Collapsible sections are matched by the testIDs added to their host views.
describe("starter flow", () => {
	beforeAll(async () => {
		await device.launchApp({ newInstance: true });
	});

	beforeEach(async () => {
		await device.reloadReactNative();
	});

	it("navigates Home -> Explore and expands a collapsible", async () => {
		// The Home tab is selected on launch; its label is visible in the tab bar.
		await expect(element(by.text("Home")).atIndex(0)).toBeVisible();

		// Switch to the Explore tab (native tab bar item, matched by label).
		await element(by.text("Explore")).atIndex(0).tap();

		// The Explore screen renders its "File-based routing" collapsible header.
		await expect(
			element(by.id("collapsible-file-based-routing")),
		).toBeVisible();

		// Its content is collapsed until the header is pressed.
		await element(by.id("collapsible-file-based-routing")).tap();
		await expect(
			element(by.id("collapsible-file-based-routing-content")),
		).toBeVisible();
	});
});
