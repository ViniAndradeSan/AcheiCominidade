import { renderHook } from "@testing-library/react-native";
import { useColorScheme as useRNColorScheme } from "react-native";

import { useColorScheme } from "@/hooks/use-color-scheme.web";

jest.mock("react-native", () => ({
	useColorScheme: jest.fn(),
}));

const mockedRNColorScheme = jest.mocked(useRNColorScheme);

describe("useColorScheme (web)", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it("returns the RN color scheme after hydration", async () => {
		mockedRNColorScheme.mockReturnValue("dark");

		// renderHook flushes effects, so hasHydrated is already true here.
		const { result } = await renderHook(() => useColorScheme());

		expect(result.current).toBe("dark");
	});

	it("reflects a light RN color scheme after hydration", async () => {
		mockedRNColorScheme.mockReturnValue("light");

		const { result } = await renderHook(() => useColorScheme());

		expect(result.current).toBe("light");
	});
});
