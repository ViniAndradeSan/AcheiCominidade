import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useTheme } from "@/hooks/use-theme";

jest.mock("@/hooks/use-color-scheme");

const mockedUseColorScheme = jest.mocked(useColorScheme);

describe("useTheme", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it("returns the light palette when the scheme is 'light'", () => {
		mockedUseColorScheme.mockReturnValue("light");
		expect(useTheme()).toBe(Colors.light);
	});

	it("maps the 'unspecified' scheme to the light palette", () => {
		// biome-ignore lint/suspicious/noExplicitAny: exercising the RN "unspecified" branch
		mockedUseColorScheme.mockReturnValue("unspecified" as any);
		expect(useTheme()).toBe(Colors.light);
	});

	it("returns the dark palette when the scheme is 'dark'", () => {
		mockedUseColorScheme.mockReturnValue("dark");
		expect(useTheme()).toBe(Colors.dark);
	});
});
