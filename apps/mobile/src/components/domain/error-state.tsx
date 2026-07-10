import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

type ErrorStateProps = {
	message?: string;
	onRetry?: () => void;
};

export function ErrorState({
	message = "Algo deu errado.",
	onRetry,
}: ErrorStateProps) {
	const theme = useTheme();

	return (
		<View style={styles.container}>
			<ThemedText type="default" style={styles.message}>
				{message}
			</ThemedText>

			{onRetry ? (
				<Pressable
					onPress={onRetry}
					style={[
						styles.retryButton,
						{ backgroundColor: theme.backgroundElement },
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
	},
	message: {
		textAlign: "center",
		marginBottom: Spacing.three,
	},
	retryButton: {
		paddingHorizontal: Spacing.four,
		paddingVertical: Spacing.two,
		borderRadius: Spacing.two,
	},
});
