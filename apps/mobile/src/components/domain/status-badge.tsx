import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import type { ItemStatus } from "@/lib/types";

type StatusBadgeProps = {
	status: ItemStatus;
};

export function StatusBadge({ status }: StatusBadgeProps) {
	const theme = useTheme();

	const isAvailable = status === "disponivel";

	return (
		<View
			style={[
				styles.badge,
				{
					backgroundColor: isAvailable
						? theme.backgroundSelected
						: theme.backgroundElement,
				},
			]}
		>
			<ThemedText type="smallBold">
				{isAvailable ? "Disponível" : "Devolvido"}
			</ThemedText>
		</View>
	);
}

const styles = StyleSheet.create({
	badge: {
		alignSelf: "flex-start",
		paddingHorizontal: Spacing.three,
		paddingVertical: Spacing.one,
		borderRadius: Spacing.four,
	},
});
