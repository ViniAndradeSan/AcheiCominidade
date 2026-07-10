import { Pressable, StyleSheet, Text, View } from "react-native";

type Status = "disponivel" | "devolvido";

type StatusFilterTabsProps = {
	value: Status;
	onChange: (status: Status) => void;
};

export function StatusFilterTabs({
	value,
	onChange,
}: StatusFilterTabsProps) {
	return (
		<View style={styles.container}>
			<Pressable
				style={[
					styles.tab,
					value === "disponivel" && styles.activeTab,
				]}
				onPress={() => onChange("disponivel")}
			>
				<Text
					style={[
						styles.text,
						value === "disponivel" && styles.activeText,
					]}
				>
					Disponíveis
				</Text>
			</Pressable>

			<Pressable
				style={[
					styles.tab,
					value === "devolvido" && styles.activeTab,
				]}
				onPress={() => onChange("devolvido")}
			>
				<Text
					style={[
						styles.text,
						value === "devolvido" && styles.activeText,
					]}
				>
					Devolvidos
				</Text>
			</Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		marginVertical: 12,
		borderRadius: 8,
		overflow: "hidden",
	},

	tab: {
		flex: 1,
		paddingVertical: 10,
		alignItems: "center",
		backgroundColor: "#E5E7EB",
	},

	activeTab: {
		backgroundColor: "#2563EB",
	},

	text: {
		fontWeight: "600",
		color: "#374151",
	},

	activeText: {
		color: "#FFFFFF",
	},
});