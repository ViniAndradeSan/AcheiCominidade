import { StyleSheet, View } from "react-native";
import { Spacing, Radius } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

export function ItemCardSkeleton() {
	const theme = useTheme();

	return (
		<View style={styles.card}>
			<View
				style={[styles.photo, { backgroundColor: theme.backgroundElement }]}
			/>
			<View style={styles.content}>
				<View
					style={[
						styles.line,
						styles.lineWide,
						{ backgroundColor: theme.backgroundElement },
					]}
				/>
				<View
					style={[
						styles.line,
						styles.lineChip,
						{ backgroundColor: theme.backgroundElement },
					]}
				/>
				<View
					style={[
						styles.line,
						styles.lineNarrow,
						{ backgroundColor: theme.backgroundElement },
					]}
				/>
			</View>
		</View>
	);
}

export function ItemListSkeleton({ count = 6 }: { count?: number }) {
	return (
		<View>
			{Array.from({ length: count }).map((_, i) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: lista estática de skeletons, ordem nunca muda
				<ItemCardSkeleton key={i} />
			))}
		</View>
	);
}

const styles = StyleSheet.create({
	card: { flexDirection: "row", gap: Spacing.three, padding: Spacing.three },
	photo: { width: 64, height: 64, borderRadius: Radius.md },
	content: { flex: 1, justifyContent: "center", gap: Spacing.two },
	line: { height: 12, borderRadius: 4 },
	lineWide: { width: "80%" },
	lineChip: { width: "40%", height: 20, borderRadius: Radius.md },
	lineNarrow: { width: "60%" },
});
