import { fireEvent, render, screen } from "@testing-library/react-native";

jest.mock("@/hooks/use-theme", () => ({
	useTheme: () => ({
		text: "#000000",
		textSecondary: "#666666",
		backgroundElement: "#eeeeee",
		backgroundSelected: "#dddddd",
	}),
}));

import { SearchBar } from "@/components/domain/search-bar";

describe("SearchBar", () => {
	const mockOnChangeText = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("renders with default placeholder", async () => {
		await render(<SearchBar value="" onChangeText={mockOnChangeText} />);
		expect(screen.getByPlaceholderText("Buscar itens...")).toBeTruthy();
	});

	it("renders with custom placeholder", async () => {
		await render(
			<SearchBar
				value=""
				onChangeText={mockOnChangeText}
				placeholder="Buscar por titulo..."
			/>,
		);
		expect(screen.getByPlaceholderText("Buscar por titulo...")).toBeTruthy();
	});

	it("calls onChangeText when typing", async () => {
		await render(<SearchBar value="" onChangeText={mockOnChangeText} />);
		await fireEvent.changeText(screen.getByPlaceholderText("Buscar itens..."), "fone");
		expect(mockOnChangeText).toHaveBeenCalledWith("fone");
	});

	it("shows clear button when value is not empty", async () => {
		await render(<SearchBar value="fone" onChangeText={mockOnChangeText} />);
		expect(screen.getByLabelText("clear-search")).toBeTruthy();
	});

	it("hides clear button when value is empty", async () => {
		await render(<SearchBar value="" onChangeText={mockOnChangeText} />);
		expect(screen.queryByLabelText("clear-search")).toBeNull();
	});

	it("calls onChangeText with empty string when clear is pressed", async () => {
		await render(<SearchBar value="fone" onChangeText={mockOnChangeText} />);
		await fireEvent.press(screen.getByLabelText("clear-search"));
		expect(mockOnChangeText).toHaveBeenCalledWith("");
	});
});
