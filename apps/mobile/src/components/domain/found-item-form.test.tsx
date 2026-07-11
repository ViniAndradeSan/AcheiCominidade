import {
	fireEvent,
	render,
	screen,
	waitFor,
} from "@testing-library/react-native";

jest.mock("@/hooks/use-theme", () => ({
	useTheme: () => ({
		text: "#000000",
		textSecondary: "#666666",
		backgroundElement: "#eeeeee",
		backgroundSelected: "#dddddd",
	}),
}));

jest.mock("@/hooks/use-categories", () => ({
	useCategories: () => ({
		data: [{ id: "cat-1", name: "Eletronicos" }],
		isLoading: false,
	}),
}));

jest.mock("@/hooks/use-create-found-item", () => ({
	useCreateFoundItem: () => ({ mutate: jest.fn(), isPending: false }),
}));

jest.mock("@/hooks/use-update-found-item", () => ({
	useUpdateFoundItem: () => ({ mutate: jest.fn(), isPending: false }),
}));

jest.mock("@/hooks/use-image-picker", () => ({
	useImagePicker: () => ({
		image: null,
		error: null,
		pickFromCamera: jest.fn(),
		pickFromGallery: jest.fn(),
		clear: jest.fn(),
	}),
}));

jest.mock("expo-router", () => ({
	useRouter: () => ({ back: jest.fn(), replace: jest.fn() }),
}));

const mockCaptureCurrentLocation = jest.fn();
jest.mock("@/hooks/use-location", () => ({
	useLocation: () => ({
		latitude: -23.5505,
		longitude: -46.6333,
		loading: false,
		error: null,
		captureCurrentLocation: mockCaptureCurrentLocation,
	}),
}));

import { FoundItemForm } from "@/components/domain/found-item-form";

describe("FoundItemForm — preenchimento de localizacao", () => {
	beforeEach(() => {
		mockCaptureCurrentLocation.mockResolvedValue("Rua das Flores, 123");
	});

	it("preenche o campo com o endereco retornado ao capturar o GPS", async () => {
		await render(<FoundItemForm />);

		const locationInput = screen.getByPlaceholderText(
			"Ex.: Bloco Y, 7º andar, sala 693",
		);

		expect(locationInput.props.value).toBe("");

		fireEvent.press(screen.getByText("📍"));

		await waitFor(() =>
			expect(locationInput.props.value).toBe("Rua das Flores, 123"),
		);

		expect(mockCaptureCurrentLocation).toHaveBeenCalledTimes(1);
	});
});
