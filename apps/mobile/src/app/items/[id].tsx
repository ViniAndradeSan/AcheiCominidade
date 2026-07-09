// src/app/items/[id].tsx
import { router, Stack, useLocalSearchParams } from "expo-router";
import {
	Pressable,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	View,
} from "react-native";

import { ItemPhoto } from "@/components/domain/item-photo";
import { StatusBadge } from "@/components/domain/status-badge";
import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { useFoundItem } from "@/hooks/use-found-item";
import { useTheme } from "@/hooks/use-theme";

export default function ItemDetailScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const { data: item, isLoading, isError } = useFoundItem(id);
	const theme = useTheme();

	if (isLoading) {
		return (
			<SafeAreaView style={styles.center}>
				<ThemedText type="default">Carregando...</ThemedText>
			</SafeAreaView>
		);
	}

	if (isError || !item) {
		return (
			<SafeAreaView style={styles.center}>
				<ThemedText type="default">Item não encontrado.</ThemedText>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={styles.container}>
			<Stack.Screen options={{ title: item.title }} />
			<ScrollView contentContainerStyle={styles.content}>
				<ItemPhoto
					photoUrl={item.photoUrl}
					size="full"
					accessibilityLabel={item.title}
				/>

				<View style={styles.header}>
					<ThemedText type="title">{item.title}</ThemedText>
					<StatusBadge status={item.status} />
				</View>

				{item.description ? (
					<ThemedText type="default">{item.description}</ThemedText>
				) : null}

				<View style={styles.row}>
					<ThemedText type="smallBold">Categoria: </ThemedText>
					<ThemedText type="small">{item.category?.name ?? "—"}</ThemedText>
				</View>

				<View style={styles.row}>
					<ThemedText type="smallBold">Local: </ThemedText>
					<ThemedText type="small">{item.foundLocationText}</ThemedText>
				</View>

				{item.foundLatitude !== null && item.foundLongitude !== null ? (
					<ThemedText type="small">
						📍 {item.foundLatitude.toFixed(5)}, {item.foundLongitude.toFixed(5)}
					</ThemedText>
				) : null}

				{item.status === "disponivel" ? (
					<Pressable
						onPress={() => router.push(`/items/${id}/edit`)}
						style={[
							styles.actionButton,
							{ backgroundColor: theme.backgroundSelected },
						]}
					>
						<ThemedText type="smallBold">Marcar como devolvido</ThemedText>
					</Pressable>
				) : null}
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1 },
	center: { flex: 1, alignItems: "center", justifyContent: "center" },
	content: { padding: Spacing.three, gap: Spacing.two },
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	row: { flexDirection: "row", flexWrap: "wrap" },
	actionButton: {
		marginTop: Spacing.two,
		paddingVertical: Spacing.three,
		borderRadius: Spacing.four,
		alignItems: "center",
	},
});
