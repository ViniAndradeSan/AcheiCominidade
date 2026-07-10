// apps/mobile/src/app/items/[id]/edit.tsx

import { router, Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
	ActivityIndicator,
	Pressable,
	SafeAreaView,
	StyleSheet,
	TextInput,
	View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { useReturnItem } from "@/hooks/use-return-item";
import { useTheme } from "@/hooks/use-theme";

export default function ConfirmReturnScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const [observation, setObservation] = useState("");
	const { mutate, isPending, error } = useReturnItem();
	const theme = useTheme();

	function handleConfirm() {
		if (!id || isPending) return;

		mutate(
			{ itemId: id, observation: observation.trim() || undefined },
			{
				onSuccess: () => {
					router.replace(`/items/${id}`);
				},
				onError: (err) => {
					if (err.message.includes("409")) {
						router.replace(`/items/${id}`);
					}
				},
			},
		);
	}

	return (
		<SafeAreaView style={styles.container}>
			<Stack.Screen options={{ title: "Confirmar devolução" }} />
			<View style={styles.content}>
				<ThemedText type="subtitle">Confirmar devolução</ThemedText>
				<ThemedText type="small">
					Essa ação marca o item como devolvido. Não é possível desfazer.
				</ThemedText>

				<TextInput
					placeholder="Observação (opcional)"
					placeholderTextColor={theme.textSecondary}
					value={observation}
					onChangeText={setObservation}
					multiline
					style={[
						styles.input,
						{ borderColor: theme.backgroundElement, color: theme.text },
					]}
				/>

				{error ? (
					<ThemedText type="small" style={styles.errorText}>
						{error.message.includes("409")
							? "Este item já foi devolvido anteriormente."
							: "Não foi possível confirmar a devolução. Tente novamente."}
					</ThemedText>
				) : null}

				<Pressable
					onPress={handleConfirm}
					disabled={isPending}
					style={[
						styles.confirmButton,
						{
							backgroundColor: theme.backgroundSelected,
							opacity: isPending ? 0.6 : 1,
						},
					]}
				>
					{isPending ? (
						<ActivityIndicator />
					) : (
						<ThemedText type="smallBold">Confirmar</ThemedText>
					)}
				</Pressable>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1 },
	content: { padding: Spacing.three, gap: Spacing.three },
	input: {
		borderWidth: 1,
		borderRadius: 8,
		padding: Spacing.two,
		minHeight: 80,
		textAlignVertical: "top",
	},
	errorText: {
		color: "#D64545",
	},
	confirmButton: {
		paddingVertical: Spacing.three,
		borderRadius: Spacing.four,
		alignItems: "center",
	},
});
