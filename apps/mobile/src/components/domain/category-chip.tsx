import { Feather } from "@expo/vector-icons";
import { Pressable, type PressableProps, StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

const CATEGORY_ICONS: Record<string, keyof typeof Feather.glyphMap> = {
	eletronico: "smartphone",
	documento: "file-text",
	vestuario: "shirt",
	outro: "more-horizontal",
};

export type CategoryChipProps = {
	label: string;
	slug?: string;
	selected: boolean;
	onPress: () => void;
} & Pick<PressableProps, "style">;

export function CategoryChip({
	label,
	slug,
	selected,
	onPress,
}: CategoryChipProps) {
	const theme = useTheme();
	const iconName = slug ? CATEGORY_ICONS[slug] : undefined;

	return (
		<Pressable
			onPress={onPress}
			style={[
				styles.chip,
				{
					backgroundColor: selected
						? theme.backgroundSelected
						: theme.backgroundElement,
				},
			]}
		>
			{iconName ? (
				<Feather name={iconName} size={14} color={theme.textSecondary} />
			) : null}
			<ThemedText type={selected ? "smallBold" : "small"}>{label}</ThemedText>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	chip: {
		flexDirection: "row",
		alignItems: "center",
		gap: Spacing.one,
		paddingHorizontal: Spacing.three,
		paddingVertical: Spacing.two,
		borderRadius: Radius.md,
	},
});
