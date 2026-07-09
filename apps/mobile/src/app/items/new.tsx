import { Stack } from "expo-router";
import { SafeAreaView, StyleSheet } from "react-native";
import { FoundItemForm } from "@/components/domain/found-item-form";

export default function NewItemScreen() {
	return (
		<SafeAreaView style={styles.container}>
			<Stack.Screen options={{ title: "Registrar item" }} />
			<FoundItemForm />
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
