import { Pressable, StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { Spacing, Radius } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

type Status = "disponivel" | "devolvido";

type StatusFilterTabsProps = {
	value: Status;
	onChange: (status: Status) => void;
};

export function StatusFilterTabs({ value, onChange }: StatusFilterTabsProps) {
	const theme = useTheme();

	return (
		<View
			style={[
				styles.container,
				{ backgroundColor: theme.backgroundElement, borderRadius: Radius.md },
			]}
		>
			<Pressable
				onPress={() => onChange("disponivel")}
				style={({ pressed }) => [
					styles.tab,
					{
						backgroundColor:
							value === "disponivel" ? theme.primary : "transparent",
						opacity: pressed ? 0.85 : 1,
					},
				]}
			>
				<ThemedText
					type={value === "disponivel" ? "smallBold" : "small"}
					style={{ color: value === "disponivel" ? theme.primaryText : theme.text }}
				>
					Disponíveis
				</ThemedText>
			</Pressable>

			<Pressable
				onPress={() => onChange("devolvido")}
				style={({ pressed }) => [
					styles.tab,
					{
						backgroundColor:
							value === "devolvido" ? theme.primary : "transparent",
						opacity: pressed ? 0.85 : 1,
					},
				]}
			>
				<ThemedText
					type={value === "devolvido" ? "smallBold" : "small"}
					style={{ color: value === "devolvido" ? theme.primaryText : theme.text }}
				>
					Devolvidos
				</ThemedText>
			</Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		marginVertical: Spacing.two,
		overflow: "hidden",
	},

	tab: {
		flex: 1,
		paddingVertical: Spacing.two,
		alignItems: "center",
		justifyContent: "center",
	},
});
