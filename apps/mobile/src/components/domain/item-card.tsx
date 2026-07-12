import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Radius, Shadows, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import type { FoundItem } from "@/lib/types";

import { CategoryChip } from "./category-chip";
import { ItemPhoto } from "./item-photo";
import { StatusBadge } from "./status-badge";

type ItemCardProps = {
	item: FoundItem;
	onPress?: () => void;
};

export function ItemCard({ item, onPress }: ItemCardProps) {
	const theme = useTheme();

	return (
		<Pressable
			onPress={onPress}
			style={({ pressed }) => [
				styles.card,
				Shadows.sm,
				{ backgroundColor: theme.backgroundElevated },
				pressed && styles.pressed,
			]}
		>
			<View style={styles.photoWrapper}>
				<ItemPhoto
					photoUrl={item.photoUrl}
					accessibilityLabel={item.title}
				/>
			</View>

			<View style={styles.content}>
				<View style={styles.header}>
					<ThemedText type="smallBold" numberOfLines={2}>
						{item.title}
					</ThemedText>

					<StatusBadge status={item.status} />
				</View>

				<CategoryChip
					label={item.category?.name ?? ""}
					slug={item.category?.slug}
					selected={false}
					onPress={() => {}}
				/>

				<ThemedText type="small" numberOfLines={1}>
					{item.foundLocationText}
				</ThemedText>
			</View>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	card: {
		flexDirection: "row",
		gap: Spacing.three,
		padding: Spacing.three,
		borderRadius: Radius.lg,
	},

	photoWrapper: {
		width: 96,
		height: 96,
		borderRadius: Radius.sm,
		overflow: "hidden",
	},

	content: {
		flex: 1,
		justifyContent: "flex-start",
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-start",
		gap: Spacing.two,
	},
	pressed: {
		opacity: 0.8,
	},
	category: {
		marginTop: Spacing.one,
		marginBottom: Spacing.one,
	},
});
