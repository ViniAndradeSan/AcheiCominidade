import { render, screen } from "@testing-library/react-native";
import { Text, View } from "react-native";

jest.mock("@/hooks/use-theme", () => ({
	useTheme: () => ({
		text: "#000000",
		textSecondary: "#666666",
		backgroundElement: "#eeeeee",
		backgroundSelected: "#dddddd",
	}),
}));

import { SearchBar } from "@/components/domain/search-bar";

it("debug render", () => {
	try {
		render(<SearchBar value="" onChangeText={jest.fn()} />);
		console.log("RENDER OK, screen:", screen.toJSON());
	} catch (e) {
		console.error("RENDER FAILED:", e);
	}
});
