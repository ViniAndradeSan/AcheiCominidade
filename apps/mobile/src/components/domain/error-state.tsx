import { Feather } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { NetworkError } from "@/lib/api/client";

type ErrorStateProps = {
	message?: string;
	onRetry?: () => void;
};

export function getErrorMessage(
	error: unknown,
	defaultMessage = "Algo deu errado.",
) {
	if (error instanceof NetworkError) {
		return "Não foi possível conectar ao servidor. Verifique sua internet e tente novamente.";
	}

	return defaultMessage;
}

export function ErrorState({
	message = "Algo deu errado.",
	onRetry,
}: ErrorStateProps) {
	const theme = useTheme();

	return (
		<View style={styles.container}>
			<Feather name="alert-triangle" size={48} color={theme.danger} />

			<ThemedText type="subtitle" style={styles.message}>
				{message}
			</ThemedText>

			{onRetry ? (
				<Pressable
					onPress={onRetry}
					style={[
						styles.retryButton,
						{ backgroundColor: theme.surface, borderColor: theme.border },
					]}
				>
					<ThemedText type="smallBold">Tentar novamente</ThemedText>
				</Pressable>
			) : null}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		padding: Spacing.four,
		gap: Spacing.two,
	},

	message: {
		textAlign: "center",
	},

	retryButton: {
		marginTop: Spacing.one,
		paddingHorizontal: Spacing.four,
		paddingVertical: Spacing.two,
		borderRadius: Radius.md,
		borderWidth: 1,
	},
});
