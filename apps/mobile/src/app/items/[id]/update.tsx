import { Stack, useLocalSearchParams } from "expo-router";

import { ErrorState } from "@/components/domain/error-state";
import { FoundItemForm } from "@/components/domain/found-item-form";
import { LoadingState } from "@/components/domain/loading-state";
import { Screen } from "@/components/screen";
import { useFoundItem } from "@/hooks/use-found-item";

export default function UpdateFoundItemScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();

	const { data: item, isLoading, isError } = useFoundItem(id);

	if (isLoading) {
		return <LoadingState />;
	}

	if (isError || !item) {
		return <ErrorState message="Item não encontrado." />;
	}

	return (
		<Screen>
			<Stack.Screen
				options={{
					title: "Editar item",
				}}
			/>

			<FoundItemForm mode="edit" initialValues={item} />
		</Screen>
	);
}
