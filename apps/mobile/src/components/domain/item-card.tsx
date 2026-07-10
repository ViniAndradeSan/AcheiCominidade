import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import type { FoundItem } from "@/lib/types";

import { CategoryChip } from "./category-chip";
import { ItemPhoto } from "./item-photo";
import { StatusBadge } from "./status-badge";

type ItemCardProps = {
	item: FoundItem;
	onPress?: () => void;
};

export function ItemCard({ item, onPress }: ItemCardProps) {
	return (
		<Pressable
			onPress={onPress}
			style={({ pressed }) => [styles.card, pressed && styles.pressed]}
		>
			<ItemPhoto photoUrl={item.photoUrl} accessibilityLabel={item.title} />

			<View style={styles.content}>
				<View style={styles.header}>
					<ThemedText type="smallBold" numberOfLines={2}>
						{item.title}
					</ThemedText>

					<StatusBadge status={item.status} />
				</View>

				<CategoryChip
					label={item.category?.name ?? ""}
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
