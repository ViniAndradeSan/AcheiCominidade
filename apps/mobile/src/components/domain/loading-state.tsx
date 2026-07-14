import { ActivityIndicator, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

type LoadingStateProps = {
	message?: string;
};

export function LoadingState({ message = "Carregando..." }: LoadingStateProps) {
	const theme = useTheme();

	return (
		<View style={styles.container}>
			<ActivityIndicator size="large" color={theme.text} />
			<ThemedText type="default" style={styles.message}>
				{message}
			</ThemedText>
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
		marginTop: Spacing.three,
	},
});
