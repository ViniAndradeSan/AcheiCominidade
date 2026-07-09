import { Pressable, type PressableProps, StyleSheet } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

export type CategoryChipProps = {
	label: string;
	selected: boolean;
	onPress: () => void;
} & Pick<PressableProps, "style">;

export function CategoryChip({ label, selected, onPress }: CategoryChipProps) {
	const theme = useTheme();

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
			<ThemedText type={selected ? "smallBold" : "small"}>{label}</ThemedText>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	chip: {
		paddingHorizontal: Spacing.three,
		paddingVertical: Spacing.two,
		borderRadius: Spacing.four,
	},
});
