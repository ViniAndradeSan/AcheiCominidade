import { Feather } from "@expo/vector-icons";
import type { Feather as FeatherIcon } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

type EmptyStateProps = {
	title: string;
	description?: string;
	icon?: keyof typeof FeatherIcon.glyphMap;
};

export function EmptyState({
	title,
	description,
	icon = "inbox",
}: EmptyStateProps) {
	const theme = useTheme();

	return (
		<View style={styles.container}>
			<Feather name={icon} size={48} color={theme.textSecondary} />

			<ThemedText type="subtitle" style={styles.title}>
				{title}
			</ThemedText>

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
		gap: Spacing.two,
	},

	title: {
		textAlign: "center",
	},

	description: {
		textAlign: "center",
	},
});
