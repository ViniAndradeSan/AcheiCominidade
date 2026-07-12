import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
	Pressable,
	ScrollView,
	StyleSheet,
	View,
} from "react-native";

import { ConfirmDialog } from "@/components/domain/confirm-dialog";
import { ErrorState } from "@/components/domain/error-state";
import { ItemPhoto } from "@/components/domain/item-photo";
import { LoadingState } from "@/components/domain/loading-state";
import { Screen } from "@/components/screen";
import { StatusBadge } from "@/components/domain/status-badge";
import { Button } from "@/components/ui/button";
import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { useDeleteFoundItem } from "@/hooks/use-delete-found-item";
import { useFoundItem } from "@/hooks/use-found-item";
import { useTheme } from "@/hooks/use-theme";
import { useUndoReturn } from "@/hooks/use-undo-return";

export default function ItemDetailScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const { data: item, isLoading, isError, refetch } = useFoundItem(id);
	const theme = useTheme();

	const [confirmVisible, setConfirmVisible] = useState(false);

	const deleteItem = useDeleteFoundItem();
	const undoReturn = useUndoReturn();

	if (isLoading) {
		return (
			<Screen style={styles.center}>
				<LoadingState />
			</Screen>
		);
	}

	if (isError || !item) {
		return (
			<Screen style={styles.center}>
				<ErrorState message="Item não encontrado." onRetry={() => refetch()} />
			</Screen>
		);
	}

	return (
		<Screen style={styles.container}>
			<Stack.Screen
				options={{
					title: item.title,
					headerRight: () => (
						<Pressable
							onPress={() => setConfirmVisible(true)}
							hitSlop={8}
							style={({ pressed }) => ({
								  padding: Spacing.two,
								  borderRadius: 8,
								  backgroundColor: theme.lildanger,
								  opacity: pressed ? 0.5 : 1 })}
						>
							<Feather name="trash-2" size={20} color={theme.danger} />
						</Pressable>
					),
				}}
			/>

			<ScrollView contentContainerStyle={styles.content}>
				<View style={styles.heroPhoto}>
					<ItemPhoto
						photoUrl={item.photoUrl}
						size="full"
						accessibilityLabel={item.title}
					/>
					<LinearGradient
						colors={["transparent", "rgba(0,0,0,0.7)"]}
						style={styles.heroGradient}
					/>
					<View style={styles.heroOverlay}>
						<ThemedText
							type="title"
							style={{ color: "#FFFFFF" }}
							numberOfLines={2}
						>
							{item.title}
						</ThemedText>
						<StatusBadge status={item.status} />
					</View>
				</View>

				{item.description ? (
					<ThemedText type="default">{item.description}</ThemedText>
				) : null}

				<View style={styles.row}>
					<ThemedText type="smallBold">Categoria:</ThemedText>
					<ThemedText type="small"> {item.category?.name ?? "—"}</ThemedText>
				</View>

				<View style={styles.row}>
					<ThemedText type="smallBold">Local:</ThemedText>
					<ThemedText type="small"> {item.foundLocationText}</ThemedText>
				</View>

				{item.foundLatitude !== null && item.foundLongitude !== null ? (
					<ThemedText type="small">
						<Feather name="map-pin" size={14} color={theme.text} />{" "}
						{item.foundLatitude.toFixed(5)}, {item.foundLongitude.toFixed(5)}
					</ThemedText>
				) : null}

				{item.status === "disponivel" && (
					<View style={styles.actions}>
						<Button
							label="Marcar como devolvido"
							variant="primary"
							onPress={() => router.push(`/items/${id}/edit`)}
						/>
						<Button
							label="Editar item"
							variant="ghost"
							onPress={() => router.push(`/items/${id}/update`)}
						/>
					</View>
				)}

				{item.status === "devolvido" && item.itemReturn && (
					<Button
						label={undoReturn.isPending ? "Revertendo..." : "Voltar para disponível"}
						variant="ghost"
						loading={undoReturn.isPending}
						disabled={undoReturn.isPending}
						onPress={() => undoReturn.mutate(item.itemReturn!.id)}
					/>
				)}
			</ScrollView>

			<ConfirmDialog
				visible={confirmVisible}
				title="Deletar item?"
				message="Essa ação não pode ser desfeita."
				cancelText="Cancelar"
				confirmText="Deletar"
				onCancel={() => setConfirmVisible(false)}
				onConfirm={() => {
					if (deleteItem.isPending) return;

					deleteItem.mutate(item.id, {
						onSuccess: () => {
							setConfirmVisible(false);
							router.replace("/");
						},
						onError: () => {
							setConfirmVisible(false);
						},
					});
				}}
			/>
		</Screen>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},

	center: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},

	content: {
		padding: Spacing.three,
		gap: Spacing.two,
	},

	heroPhoto: {
		position: "relative",
		marginHorizontal: -Spacing.three,
		marginTop: -Spacing.three,
	},

	heroGradient: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		height: 120,
	},

	heroOverlay: {
		position: "absolute",
		bottom: Spacing.three,
		left: Spacing.three,
		right: Spacing.three,
		gap: Spacing.one,
	},

	row: {
		flexDirection: "row",
		flexWrap: "wrap",
	},

	actions: {
		gap: Spacing.two,
		marginTop: Spacing.two,
	},
});
