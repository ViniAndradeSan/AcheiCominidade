import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";

type EmptyStateProps = {
	title: string;
	description?: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
	return (
		<View style={styles.container}>
			<ThemedText type="subtitle">{title}</ThemedText>

			{description ? (
				<ThemedText type="default" style={styles.description}>
					{description}
				</ThemedText>
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

	description: {
		marginTop: Spacing.two,
		textAlign: "center",
	},
});
