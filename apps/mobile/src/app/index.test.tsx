import { render, screen } from "@testing-library/react-native";

import HomeScreen from "@/app/index";

describe("Home screen smoke render", () => {
	it("renders the Home screen welcome text", async () => {
		await render(<HomeScreen />);

		// The source uses "Welcome to&nbsp;Expo"; the non-breaking space ( )
		// renders between the words, so match with a flexible matcher.
		expect(screen.getByText(/Welcome to\s*Expo/u)).toBeTruthy();
	});
});
