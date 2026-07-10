import { Stack, useLocalSearchParams } from "expo-router";
import { SafeAreaView, StyleSheet } from "react-native";

import { FoundItemForm } from "@/components/domain/found-item-form";
import { LoadingState } from "@/components/domain/loading-state";
import { ErrorState } from "@/components/domain/error-state";
import { useFoundItem } from "@/hooks/use-found-item";

export default function UpdateFoundItemScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();

	const { data: item, isLoading, isError } = useFoundItem(id);

	if (isLoading) {
		return <LoadingState />;
	}

	if (isError || !item) {
		return (
			<ErrorState
				message="Item não encontrado."
			/>
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