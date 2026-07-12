import { Stack } from "expo-router";

import { FoundItemForm } from "@/components/domain/found-item-form";
import { Screen } from "@/components/screen";

export default function NewItemScreen() {
	return (
		<Screen>
			<Stack.Screen options={{ title: "Registrar item" }} />
			<FoundItemForm />
		</Screen>
	);
}
