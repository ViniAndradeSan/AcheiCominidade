import { render, screen } from "@testing-library/react-native";

import ExploreScreen from "@/app/explore";

describe("Explore screen smoke render", () => {
	it("renders the Explore screen title and collapsible sections", async () => {
		await render(<ExploreScreen />);

		expect(screen.getByText("Explore")).toBeTruthy();
		expect(screen.getByText("File-based routing")).toBeTruthy();
		expect(screen.getByText("Animations")).toBeTruthy();
	});
});
