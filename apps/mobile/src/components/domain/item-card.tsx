import { Link } from "expo-router";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import type { FoundItem } from "@/lib/types";

import { ItemPhoto } from "./item-photo";
import { StatusBadge } from "./status-badge";

type ItemCardProps = {
	item: FoundItem;
};

export function ItemCard({ item }: ItemCardProps) {
	return (
		<Link href={`/items/${item.id}`} asChild>
			<View style={styles.card}>
				<ItemPhoto photoUrl={item.photoUrl} accessibilityLabel={item.title} />

				<View style={styles.content}>
					<ThemedText type="smallBold">{item.title}</ThemedText>

					<ThemedText type="small">{item.foundLocationText}</ThemedText>

					<StatusBadge status={item.status} />
				</View>
			</View>
		</Link>
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
		justifyContent: "space-between",
	},
});
