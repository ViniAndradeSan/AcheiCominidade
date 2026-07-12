/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import "@/global.css";

import { Platform } from "react-native";

export const Colors = {
	light: {
		text: "#0A0A0B",
		textSecondary: "#6B7076",
		background: "#FFFFFF",
		backgroundElement: "#F5F5F7",
		backgroundSelected: "#EAEAEE",
		backgroundElevated: "#FFFFFF",
		border: "#E4E4E8",
		primary: "#2255E0",
		primaryText: "#FFFFFF",
		success: "#1D9A5F",
		danger: "#D64545",
		statusAvailable: "#16A34A",
		statusReturned: "#6366F1",
	},
	dark: {
		text: "#F5F5F7",
		textSecondary: "#9B9FA6",
		background: "#0A0A0B",
		backgroundElement: "#1C1C1F",
		backgroundSelected: "#28282D",
		backgroundElevated: "#1A1A1E",
		border: "#2E2E33",
		primary: "#4C7CF0",
		primaryText: "#FFFFFF",
		success: "#34B876",
		danger: "#E5697A",
		statusAvailable: "#22C55E",
		statusReturned: "#818CF8",
	},
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
	ios: {
		/** iOS `UIFontDescriptorSystemDesignDefault` */
		sans: "system-ui",
		/** iOS `UIFontDescriptorSystemDesignSerif` */
		serif: "ui-serif",
		/** iOS `UIFontDescriptorSystemDesignRounded` */
		rounded: "ui-rounded",
		/** iOS `UIFontDescriptorSystemDesignMonospaced` */
		mono: "ui-monospace",
	},
	default: {
		sans: "normal",
		serif: "serif",
		rounded: "normal",
		mono: "monospace",
	},
	web: {
		sans: "var(--font-display)",
		serif: "var(--font-serif)",
		rounded: "var(--font-rounded)",
		mono: "var(--font-mono)",
	},
});

export const Spacing = {
	half: 2,
	one: 4,
	two: 8,
	three: 16,
	four: 24,
	five: 32,
	six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;

export const Radius = {
	sm: 8,
	md: 12,
	lg: 16,
	pill: 999,
} as const;

export const Shadows = {
	sm: {
		shadowColor: "#000",
		shadowOpacity: 0.08,
		shadowRadius: 2,
		elevation: 2,
	},
	md: {
		shadowColor: "#000",
		shadowOpacity: 0.12,
		shadowRadius: 4,
		elevation: 4,
	},
	lg: {
		shadowColor: "#000",
		shadowOpacity: 0.16,
		shadowRadius: 8,
		elevation: 8,
	},
} as const;
