import { Feather } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import { GlassView } from "expo-glass-effect";
import * as Haptics from "expo-haptics";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
	ActivityIndicator,
	FlatList,
	Pressable,
	RefreshControl,
	ScrollView,
	StyleSheet,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CategoryChip } from "@/components/domain/category-chip";
import { EmptyState } from "@/components/domain/empty-state";
import { ErrorState, getErrorMessage } from "@/components/domain/error-state";
import { HomeHeader } from "@/components/domain/home-header";
import { ItemCard } from "@/components/domain/item-card";
import { ItemListSkeleton } from "@/components/domain/item-card-skeleton";
import { SearchBar } from "@/components/domain/search-bar";
import { StatusFilterTabs } from "@/components/domain/status-filter-tabs";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";
import { useCategories } from "@/hooks/use-categories";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useFoundItems } from "@/hooks/use-found-items";
import { useItemCounts } from "@/hooks/use-item-counts";
import { useTheme } from "@/hooks/use-theme";
import { foundItemsKeys, getFoundItems } from "@/lib/api/found-items.queries";
import type { FoundItem, ItemStatus } from "@/lib/types";

export default function HomeScreen() {
	const router = useRouter();
	const theme = useTheme();

	const [categorySlug, setCategorySlug] = useState<string | null>(null);
	const [status, setStatus] = useState<ItemStatus>("disponivel");
	const [searchText, setSearchText] = useState("");
	const debouncedSearch = useDebouncedValue(searchText, 400);

	const { data: categories } = useCategories();
	const { data: counts } = useItemCounts();

	const {
		data: items,
		isLoading,
		isFetching,
		isError,
		error,
		refetch,
		isRefetching,
	} = useFoundItems({
		status,
		category: categorySlug ?? undefined,
		search: debouncedSearch.trim() || undefined,
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
			staleTime: 15_000,
		});

		for (const c of categories) {
			if (c.slug === categorySlug) continue;
			queryClient.prefetchQuery({
				queryKey: foundItemsKeys.list({ status, category: c.slug }),
				queryFn: () => getFoundItems({ status, category: c.slug }),
				staleTime: 15_000,
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [categories, status, categorySlug]);

	const isInitialLoading = isLoading && items === undefined;

	return (
		<ThemedView style={styles.container}>
			<SafeAreaView style={styles.safeArea}>
				<Stack.Screen options={{ headerShown: false }} />

				<HomeHeader />

				<StatusFilterTabs value={status} onChange={setStatus} counts={counts} />

				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					style={styles.chipScroll}
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
							slug={c.slug}
							selected={categorySlug === c.slug}
							onPress={() => setCategorySlug(c.slug)}
						/>
					))}
			</ScrollView>

			<SearchBar value={searchText} onChangeText={setSearchText} />

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
					renderItem={({ item, index }) => (
						<ItemCard
							item={item}
							index={index}
							onPress={() => router.push(`/items/${item.id}`)}
						/>
					)}
					refreshControl={
						<RefreshControl
							refreshing={isRefetching}
							onRefresh={() => refetch()}
							tintColor={theme.primary}
							colors={[theme.primary]}
							progressBackgroundColor={theme.backgroundElevated}
						/>
					}
					contentContainerStyle={styles.list}
					ListEmptyComponent={
						isInitialLoading ? (
							<ItemListSkeleton />
						) : isError ? (
							<ErrorState
								message={getErrorMessage(error, "Erro ao carregar itens.")}
								onRetry={() => refetch()}
							/>
						) : (
						<EmptyState
							icon={
								debouncedSearch
									? "search"
									: categorySlug
										? "filter"
										: "inbox"
							}
							title={
								debouncedSearch
									? `Nenhum resultado para "${debouncedSearch}"`
									: "Nenhum item encontrado"
							}
							description={
								debouncedSearch
									? "Tente buscar com outras palavras"
									: categorySlug
										? "Nenhum item nessa categoria"
										: `Nenhum item ${
												status === "disponivel" ? "A procurar" : "devolvido"
											} encontrado`
							}
						/>
						)
					}
				/>

				<View style={styles.fabContainer}>
					<GlassView style={styles.fabGlass} />
					<Pressable
						onPress={() => {
							Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
							router.push("/items/new");
						}}
						style={[styles.fabPressable, { backgroundColor: theme.primary }]}
					>
						<Feather name="plus" size={24} color={theme.primaryText} />
					</Pressable>
				</View>
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
		flexDirection: "row",
		alignItems: "center",
		gap: Spacing.two,
		paddingHorizontal: Spacing.three,
		paddingVertical: 0,
	},

	chipScroll: {
		flexGrow: 0,
		flexShrink: 0,
		alignSelf: "stretch",
		minHeight: 44,
	},

	list: {
		flexGrow: 1,
	},

	filterIndicator: {
		paddingVertical: Spacing.two,
	},

	fabContainer: {
		position: "absolute",
		bottom: Spacing.four,
		right: Spacing.four,
		width: 56,
		height: 56,
		borderRadius: 28,
	},

	fabGlass: {
		...StyleSheet.absoluteFill,
		borderRadius: 28,
	},

	fabPressable: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 28,
	},
});
