import { useLocalSearchParams } from "expo-router";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useFoundItem } from "@/hooks/use-found-item";

export default function ItemDetailsScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();

	const { data: item, isLoading } = useFoundItem(id);

	if (isLoading) {
		return (
			<ThemedView>
				<ThemedText>Carregando...</ThemedText>
			</ThemedView>
		);
	}

	if (!item) {
		return (
			<ThemedView>
				<ThemedText>Item não encontrado.</ThemedText>
			</ThemedView>
		);
	}

	return (
		<ThemedView>
			<ThemedText type="title">{item.title}</ThemedText>

			<ThemedText>{item.description}</ThemedText>

			<ThemedText>{item.foundLocationText}</ThemedText>

			<ThemedText>{item.status}</ThemedText>
		</ThemedView>
	);
}
