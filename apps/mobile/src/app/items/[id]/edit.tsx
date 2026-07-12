// apps/mobile/src/app/items/[id]/edit.tsx

import { router, Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { Screen } from "@/components/screen";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Radius, Spacing } from "@/constants/theme";
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
		<Screen>
			<Stack.Screen options={{ title: "Confirmar devolução" }} />
			<View style={styles.content}>
				<ThemedText type="subtitle">Confirmar devolução</ThemedText>
				<ThemedText type="small">
					Essa ação marca o item como devolvido! Gostaria de adicionar uma
					observação?
				</ThemedText>

				<TextInput
					placeholder="Observação (opcional)"
					placeholderTextColor={theme.textSecondary}
					value={observation}
					onChangeText={setObservation}
					multiline
					style={[
						styles.input,
						{
							borderColor: theme.border,
							backgroundColor: theme.surface,
							color: theme.text,
						},
					]}
				/>

				{error ? (
					<ThemedText type="small" style={{ color: theme.danger }}>
						{error.message.includes("409")
							? "Este item já foi devolvido anteriormente."
							: "Não foi possível confirmar a devolução. Tente novamente."}
					</ThemedText>
				) : null}

				<Button
					label="Confirmar"
					variant="primary"
					loading={isPending}
					disabled={isPending}
					onPress={handleConfirm}
				/>
			</View>
		</Screen>
	);
}

const styles = StyleSheet.create({
	content: { padding: Spacing.three, gap: Spacing.three },
	input: {
		borderWidth: 1,
		borderRadius: Radius.md,
		padding: Spacing.two,
		minHeight: 80,
		textAlignVertical: "top",
	},
});
