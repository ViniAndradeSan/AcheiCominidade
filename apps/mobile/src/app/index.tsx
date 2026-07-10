import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, Pressable, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CategoryChip } from "@/components/domain/category-chip";
import { EmptyState } from "@/components/domain/empty-state";
import { ItemCard } from "@/components/domain/item-card";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";
import { useCategories } from "@/hooks/use-categories";
import { useFoundItems } from "@/hooks/use-found-items";
import { useTheme } from "@/hooks/use-theme";
import type { FoundItem } from "@/lib/types";

export default function HomeScreen() {
	const router = useRouter();
	const theme = useTheme();
	const [categorySlug, setCategorySlug] = useState<string | null>(null);

	const { data: categories } = useCategories();
	const {
		data: items,
		isLoading,
		refetch,
		isRefetching,
	} = useFoundItems({
		status: "disponivel",
		category: categorySlug ?? undefined,
	});

	return (
		<ThemedView style={styles.container}>
			<SafeAreaView style={styles.safeArea}>
				<ThemedText type="title" style={styles.title}>
					Achei Comunidade
				</ThemedText>

				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={styles.chipRow}
				>
					<CategoryChip
						label="Todas"
						selected={categorySlug === null}
						onPress={() => setCategorySlug(null)}
					/>
					{categories?.map((c) => (
						<CategoryChip
							key={c.id}
							label={c.name}
							selected={categorySlug === c.slug}
							onPress={() => setCategorySlug(c.slug)}
						/>
					))}
				</ScrollView>

				<FlatList
					data={items}
					keyExtractor={(item: FoundItem) => item.id}
					renderItem={({ item }) => (
						<ItemCard
							item={item}
							onPress={() => router.push(`/items/${item.id}`)}
						/>
					)}
					refreshing={isRefetching}
					onRefresh={() => refetch()}
					contentContainerStyle={styles.list}
					ListEmptyComponent={
						!isLoading ? (
							<EmptyState
								title="Nenhum item encontrado"
								description={
									categorySlug
										? "Nenhum item nessa categoria"
										: "Nenhum item encontrado ainda"
								}
							/>
						) : null
					}
				/>

				<Pressable
					onPress={() => router.push("/items/new")}
					style={[styles.fab, { backgroundColor: theme.backgroundSelected }]}
				>
					<ThemedText type="smallBold">+</ThemedText>
				</Pressable>
			</SafeAreaView>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	safeArea: {
		flex: 1,
	},
	title: {
		textAlign: "center",
		paddingTop: Spacing.two,
	},
	chipRow: {
		gap: Spacing.two,
		paddingHorizontal: Spacing.three,
		paddingVertical: Spacing.two,
	},
	list: {
		flexGrow: 1,
	},
	fab: {
		position: "absolute",
		bottom: Spacing.four,
		right: Spacing.four,
		width: 56,
		height: 56,
		borderRadius: 28,
		alignItems: "center",
		justifyContent: "center",
	},
});
