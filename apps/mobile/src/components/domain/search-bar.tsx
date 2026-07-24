import { Feather } from "@expo/vector-icons";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

type SearchBarProps = {
	value: string;
	onChangeText: (text: string) => void;
	placeholder?: string;
};

export function SearchBar({
	value,
	onChangeText,
	placeholder = "Buscar itens...",
}: SearchBarProps) {
	const theme = useTheme();

	return (
		<View style={styles.row}>
			<Feather name="search" size={16} color={theme.textSecondary} />

			<TextInput
				value={value}
				onChangeText={onChangeText}
				placeholder={placeholder}
				placeholderTextColor={theme.textSecondary}
				style={[
					styles.input,
					{
						color: theme.text,
						backgroundColor: theme.backgroundElement,
						borderColor: theme.backgroundSelected,
					},
				]}
			/>

			{value.length > 0 && (
				<Pressable
					accessibilityLabel="clear-search"
					onPress={() => onChangeText("")}
					style={styles.clearButton}
				>
					<Feather name="x" size={16} color={theme.textSecondary} />
				</Pressable>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	row: {
		flexDirection: "row",
		alignItems: "center",
		gap: Spacing.two,
		paddingHorizontal: Spacing.three,
		paddingVertical: Spacing.one,
	},
	input: {
		flex: 1,
		borderWidth: 1,
		borderRadius: Radius.sm,
		paddingHorizontal: Spacing.three,
		paddingVertical: Spacing.two,
		fontSize: 16,
	},
	clearButton: {
		padding: Spacing.one,
	},
});
