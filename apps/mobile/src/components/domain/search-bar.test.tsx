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

	it("renders with default placeholder", () => {
		render(<SearchBar value="" onChangeText={mockOnChangeText} />);
		expect(screen.getByPlaceholderText("Buscar itens...")).toBeTruthy();
	});

	it("renders with custom placeholder", () => {
		render(
			<SearchBar
				value=""
				onChangeText={mockOnChangeText}
				placeholder="Buscar por titulo..."
			/>,
		);
		expect(screen.getByPlaceholderText("Buscar por titulo...")).toBeTruthy();
	});

	it("calls onChangeText when typing", () => {
		render(<SearchBar value="" onChangeText={mockOnChangeText} />);
		fireEvent.changeText(screen.getByPlaceholderText("Buscar itens..."), "fone");
		expect(mockOnChangeText).toHaveBeenCalledWith("fone");
	});

	it("shows clear button when value is not empty", () => {
		render(<SearchBar value="fone" onChangeText={mockOnChangeText} />);
		expect(screen.getByLabelText("clear-search")).toBeTruthy();
	});

	it("hides clear button when value is empty", () => {
		render(<SearchBar value="" onChangeText={mockOnChangeText} />);
		expect(screen.queryByLabelText("clear-search")).toBeNull();
	});

	it("calls onChangeText with empty string when clear is pressed", () => {
		render(<SearchBar value="fone" onChangeText={mockOnChangeText} />);
		fireEvent.press(screen.getByLabelText("clear-search"));
		expect(mockOnChangeText).toHaveBeenCalledWith("");
	});
});
