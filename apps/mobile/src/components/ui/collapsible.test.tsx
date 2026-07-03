import { fireEvent, render, screen } from "@testing-library/react-native";
import { Text } from "react-native";

import { Collapsible } from "@/components/ui/collapsible";

describe("Collapsible", () => {
	it("hides its children until the header is pressed", async () => {
		await render(
			<Collapsible title="Test section">
				<Text>Hidden content</Text>
			</Collapsible>,
		);

		// Content is collapsed initially.
		expect(screen.queryByText("Hidden content")).toBeNull();

		await fireEvent.press(screen.getByText("Test section"));

		// Content becomes visible after toggling open.
		expect(screen.getByText("Hidden content")).toBeTruthy();
	});
});
