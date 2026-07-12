import { StyleSheet, type ViewProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/use-theme";

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
