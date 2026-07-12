import { useQueryClient } from "@tanstack/react-query";
import { useRouter, Stack } from "expo-router";
import { useEffect, useState } from "react";
import {
	ActivityIndicator,
	FlatList,
	Pressable,
	ScrollView,
	StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CategoryChip } from "@/components/domain/category-chip";
import { EmptyState } from "@/components/domain/empty-state";
import { ErrorState } from "@/components/domain/error-state";
import { ItemCard } from "@/components/domain/item-card";
import { ItemListSkeleton } from "@/components/domain/item-card-skeleton";
import { StatusFilterTabs } from "@/components/domain/status-filter-tabs";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";
import { useCategories } from "@/hooks/use-categories";
import { useFoundItems } from "@/hooks/use-found-items";
import { useTheme } from "@/hooks/use-theme";
import { foundItemsKeys, getFoundItems } from "@/lib/api/found-items.queries";
import type { FoundItem, ItemStatus } from "@/lib/types";

export default function HomeScreen() {
	const router = useRouter();
	const theme = useTheme();

	const [categorySlug, setCategorySlug] = useState<string | null>(null);
	const [status, setStatus] = useState<ItemStatus>("disponivel");

	const { data: categories } = useCategories();

	const {
		data: items,
		isLoading,
		isFetching,
		isError,
		refetch,
		isRefetching,
	} = useFoundItems({
		status,
		category: categorySlug ?? undefined,
	});

	const queryClient = useQueryClient();

	// biome-ignore lint/correctness/useExhaustiveDependencies: prefetch só depende das combinações de filtro/categoria
	useEffect(() => {
		if (!categories) return;

		const otherStatus: ItemStatus =
			status === "disponivel" ? "devolvido" : "disponivel";

		queryClient.prefetchQuery({
			queryKey: foundItemsKeys.list({
				status: otherStatus,
				category: categorySlug ?? undefined,
			}),
			queryFn: () =>
				getFoundItems({
					status: otherStatus,
					category: categorySlug ?? undefined,
				}),
			staleTime: 60_000,
		});

		for (const c of categories) {
			if (c.slug === categorySlug) continue;
			queryClient.prefetchQuery({
				queryKey: foundItemsKeys.list({ status, category: c.slug }),
				queryFn: () => getFoundItems({ status, category: c.slug }),
				staleTime: 60_000,
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [categories, status, categorySlug]);

	const isInitialLoading = isLoading && items === undefined;

	return (
		<ThemedView style={styles.container}>
			<SafeAreaView style={styles.safeArea}>
				<Stack.Screen options={{ title: "Achei Comunidade" }} />

				<StatusFilterTabs value={status} onChange={setStatus} />

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

				{isFetching && !isInitialLoading && !isRefetching ? (
					<ActivityIndicator
						size="small"
						color={theme.text}
						style={styles.filterIndicator}
					/>
				) : null}

				<FlatList
					style={{ flex: 1 }}
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
						isInitialLoading ? (
							<ItemListSkeleton />
						) : isError ? (
							<ErrorState
								message="Erro ao carregar itens."
								onRetry={() => refetch()}
							/>
						) : (
							<EmptyState
								title="Nenhum item encontrado"
								description={
									categorySlug
										? "Nenhum item nessa categoria"
										: `Nenhum item ${
												status === "disponivel" ? "disponível" : "devolvido"
											} encontrado`
								}
							/>
						)
					}
				/>

				<Pressable
					onPress={() => router.push("/items/new")}
					style={[
						styles.fab,
						{
							backgroundColor: theme.backgroundSelected,
						},
					]}
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

	filterIndicator: {
		paddingVertical: Spacing.two,
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
