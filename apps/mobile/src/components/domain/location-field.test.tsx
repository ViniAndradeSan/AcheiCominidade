import { fireEvent, render, screen } from "@testing-library/react-native";

jest.mock("@expo/vector-icons", () => {
	const React = require("react");
	const { Text } = require("react-native");
	return {
		Feather: (props) => React.createElement(Text, null, props.name),
	};
});

jest.mock("@/components/themed-text", () => ({
	ThemedText: (props) => {
		const React = require("react");
		const { Text } = require("react-native");
		return React.createElement(Text, null, props.children);
	},
}));

const mockSuggestions = [
	{ displayName: "Rua das Flores, 123, São Paulo", latitude: -23.55, longitude: -46.63 },
	{ displayName: "Rua da Consolação, 456, São Paulo", latitude: -23.56, longitude: -46.64 },
];

jest.mock("@/hooks/use-address-autocomplete", () => ({
	useAddressAutocomplete: (query: string) => ({
		data: query.length >= 3 ? mockSuggestions : [],
		isLoading: false,
	}),
}));

jest.mock("@/hooks/use-theme", () => ({
	useTheme: () => ({
		text: "#000000",
		textSecondary: "#666666",
		backgroundElement: "#eeeeee",
		backgroundSelected: "#dddddd",
		backgroundElevated: "#ffffff",
		border: "#cccccc",
	}),
}));

import { LocationField } from "@/components/domain/location-field";

describe("LocationField — autocomplete de localização", () => {
	const mockOnChangeText = jest.fn();
	const mockOnUseCurrentLocation = jest.fn();
	const mockOnSelectSuggestion = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("mostra sugestões quando o campo tem 3+ caracteres", () => {
		render(
			<LocationField
				value="Rua das"
				onChangeText={mockOnChangeText}
				onUseCurrentLocation={mockOnUseCurrentLocation}
				onSelectSuggestion={mockOnSelectSuggestion}
			/>,
		);

		expect(screen.getByText("Rua das Flores, 123, São Paulo")).toBeTruthy();
		expect(screen.getByText("Rua da Consolação, 456, São Paulo")).toBeTruthy();
	});

	it("não mostra sugestões quando o campo tem menos de 3 caracteres", () => {
		render(
			<LocationField
				value="Ru"
				onChangeText={mockOnChangeText}
				onUseCurrentLocation={mockOnUseCurrentLocation}
				onSelectSuggestion={mockOnSelectSuggestion}
			/>,
		);

		expect(screen.queryByText("Rua das Flores, 123, São Paulo")).toBeNull();
	});

	it("chama onChangeText e onSelectSuggestion ao tocar numa sugestão", () => {
		render(
			<LocationField
				value="Rua das"
				onChangeText={mockOnChangeText}
				onUseCurrentLocation={mockOnUseCurrentLocation}
				onSelectSuggestion={mockOnSelectSuggestion}
			/>,
		);

		fireEvent.press(screen.getByText("Rua das Flores, 123, São Paulo"));

		expect(mockOnChangeText).toHaveBeenCalledWith("Rua das Flores, 123, São Paulo");
		expect(mockOnSelectSuggestion).toHaveBeenCalledWith({
			displayName: "Rua das Flores, 123, São Paulo",
			latitude: -23.55,
			longitude: -46.63,
		});
	});
});
