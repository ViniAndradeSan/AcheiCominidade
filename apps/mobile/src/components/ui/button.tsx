import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, type PressableProps, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

type ButtonProps = Omit<PressableProps, "style"> & {
	label: string;
	variant?: ButtonVariant;
	loading?: boolean;
	icon?: React.ReactNode;
};

export function Button({ label, variant = "primary", loading, disabled, icon, ...rest }: ButtonProps) {
	const theme = useTheme();
	const isDisabled = disabled || loading;

	const backgroundColor = {
		primary: theme.primary,
		secondary: theme.backgroundElement,
		danger: theme.danger,
		ghost: "transparent",
	}[variant];

	const textColor = variant === "primary" || variant === "danger" ? theme.primaryText : theme.text;

	return (
		<Pressable
			disabled={isDisabled}
			style={({ pressed }) => [
				styles.base,
				{ backgroundColor, opacity: isDisabled ? 0.5 : pressed ? 0.85 : 1 },
				variant === "ghost" && { borderWidth: 1, borderColor: theme.border },
			]}
			{...rest}
		>
			{loading ? (
				<ActivityIndicator color={textColor} size="small" />
			) : (
				<>
					{icon}
					<ThemedText type="smallBold" style={{ color: textColor }}>{label}</ThemedText>
				</>
			)}
		</Pressable>
	);
}

const styles = StyleSheet.create({
	base: {
		flexDirection: "row",
		gap: Spacing.two,
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: Spacing.three,
		paddingHorizontal: Spacing.four,
		borderRadius: Radius.md,
		minHeight: 48,
	},
});
