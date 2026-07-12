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
	const statusColor = isAvailable
		? theme.statusAvailable
		: theme.statusReturned;

	return (
		<View style={styles.badge}>
			<View style={[styles.dot, { backgroundColor: statusColor }]} />
			<ThemedText type="smallBold">
				{isAvailable ? "A procurar" : "Devolvido"}
			</ThemedText>
		</View>
	);
}

const styles = StyleSheet.create({
	badge: {
		alignSelf: "flex-start",
		flexDirection: "row",
		alignItems: "center",
		gap: Spacing.one,
	},
	dot: {
		width: 8,
		height: 8,
		borderRadius: 4,
	},
});
