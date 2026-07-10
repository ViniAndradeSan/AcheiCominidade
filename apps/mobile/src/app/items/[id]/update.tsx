import { Stack, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, SafeAreaView, StyleSheet } from "react-native";

import { FoundItemForm } from "@/components/domain/found-item-form";
import { ThemedText } from "@/components/themed-text";
import { useFoundItem } from "@/hooks/use-found-item";

export default function UpdateFoundItemScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();

	const { data: item, isLoading, isError } = useFoundItem(id);

	if (isLoading) {
		return (
			<SafeAreaView style={styles.center}>
				<ActivityIndicator size="large" />
			</SafeAreaView>
		);
	}

	if (isError || !item) {
		return (
			<SafeAreaView style={styles.center}>
				<ThemedText>Item não encontrado.</ThemedText>
			</SafeAreaView>
		);
	}

	return (
		<>
			<Stack.Screen
				options={{
					title: "Editar item",
				}}
			/>

			<FoundItemForm
				mode="edit"
				initialValues={item}
			/>
		</>
	);
}

const styles = StyleSheet.create({
	center: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
});