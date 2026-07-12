import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, type ViewProps } from "react-native";

import { useTheme } from "@/hooks/use-theme";
import { Spacing } from "@/constants/theme";

export function Screen({ style, ...rest }: ViewProps) {
	const theme = useTheme();

	return (
		<SafeAreaView
			style={[styles.base, { backgroundColor: theme.background }, style]}
			{...rest}
		/>
	);
}

const styles = StyleSheet.create({
	base: {
		flex: 1,
	},
});
