import { router, Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
	Pressable,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	View,
} from "react-native";

import { ConfirmDialog } from "@/components/domain/confirm-dialog";
import { ErrorState } from "@/components/domain/error-state";
import { ItemPhoto } from "@/components/domain/item-photo";
import { LoadingState } from "@/components/domain/loading-state";
import { StatusBadge } from "@/components/domain/status-badge";
import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { useDeleteFoundItem } from "@/hooks/use-delete-found-item";
import { useUndoReturn } from "@/hooks/use-undo-return";
import { useFoundItem } from "@/hooks/use-found-item";
import { useTheme } from "@/hooks/use-theme";

export default function ItemDetailScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const { data: item, isLoading, isError, refetch } = useFoundItem(id);
	const theme = useTheme();

	const [confirmVisible, setConfirmVisible] = useState(false);

	const deleteItem = useDeleteFoundItem();
	const undoReturn = useUndoReturn();

	if (isLoading) {
		return (
			<SafeAreaView style={styles.center}>
				<LoadingState />
			</SafeAreaView>
		);
	}

	if (isError || !item) {
		return (
			<SafeAreaView style={styles.center}>
				<ErrorState
					message="Item não encontrado."
					onRetry={() => refetch()}
				/>
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
					<ThemedText type="default">
						{item.description}
					</ThemedText>
				) : null}

				<View style={styles.row}>
					<ThemedText type="smallBold">
						Categoria:
					</ThemedText>
					<ThemedText type="small">
						{" "}
						{item.category?.name ?? "—"}
					</ThemedText>
				</View>

				<View style={styles.row}>
					<ThemedText type="smallBold">
						Local:
					</ThemedText>
					<ThemedText type="small">
						{" "}
						{item.foundLocationText}
					</ThemedText>
				</View>

				{item.foundLatitude !== null &&
				item.foundLongitude !== null ? (
					<ThemedText type="small">
						📍 {item.foundLatitude.toFixed(5)},{" "}
						{item.foundLongitude.toFixed(5)}
					</ThemedText>
				) : null}

				{item.status === "disponivel" && (
					<>
						<Pressable
							onPress={() =>
								router.push(`/items/${id}/edit`)
							}
							style={[
								styles.actionButton,
								{
									backgroundColor:
										theme.backgroundSelected,
								},
							]}
						>
							<ThemedText type="smallBold">
								Marcar como devolvido
							</ThemedText>
						</Pressable>

						<Pressable
							onPress={() =>
								router.push(`/items/${id}/update`)
							}
							style={[
								styles.actionButton,
								{
									backgroundColor:
										theme.backgroundElement,
								},
							]}
						>
							<ThemedText type="smallBold">
								Editar item
							</ThemedText>
						</Pressable>

						<Pressable
							onPress={() =>
								setConfirmVisible(true)
							}
							style={[
								styles.actionButton,
								styles.deleteButton,
							]}
						>
							<ThemedText
								type="smallBold"
								style={{ color: "#fff" }}
							>
								Deletar item
							</ThemedText>
						</Pressable>
					</>
				)}

				{item.status === "devolvido" && item.itemReturn && (
					<Pressable
						onPress={() =>
							undoReturn.mutate(item.itemReturn!.id)
						}
						disabled={undoReturn.isPending}
						style={[
							styles.actionButton,
							{ backgroundColor: theme.backgroundElement },
						]}
					>
						<ThemedText type="smallBold">
							{undoReturn.isPending
								? "Revertendo..."
								: "Voltar para disponível"}
						</ThemedText>
					</Pressable>
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
		</SafeAreaView>
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

	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},

	row: {
		flexDirection: "row",
		flexWrap: "wrap",
	},

	actionButton: {
		marginTop: Spacing.two,
		paddingVertical: Spacing.three,
		borderRadius: Spacing.four,
		alignItems: "center",
	},

	deleteButton: {
		backgroundColor: "#DC2626",
	},
});