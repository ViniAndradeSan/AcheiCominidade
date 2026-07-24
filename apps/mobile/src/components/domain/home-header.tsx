import { Feather } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Radius, Spacing } from "@/constants/theme";
import { getGreeting } from "@/lib/date/greeting";
import { useTheme } from "@/hooks/use-theme";

export function HomeHeader() {
	const theme = useTheme();
	const hour = new Date().getHours();

	return (
		<View style={styles.container}>
			<View style={styles.row}>
				<View
					style={[
						styles.iconCircle,
						{ backgroundColor: theme.backgroundElement },
					]}
				>
					<Feather name="map-pin" size={20} color={theme.primary} />
				</View>
				<View style={styles.texts}>
					<ThemedText type="small" style={{ color: theme.textSecondary }}>
						{getGreeting(hour)}
					</ThemedText>
					<ThemedText type="subtitle">Achei Comunidade</ThemedText>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: Spacing.three,
		paddingTop: Spacing.three,
		paddingBottom: Spacing.two,
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
		gap: Spacing.two,
	},
	iconCircle: {
		width: 40,
		height: 40,
		borderRadius: Radius.pill,
		alignItems: "center",
		justifyContent: "center",
	},
	texts: {
		flex: 1,
	},
});
