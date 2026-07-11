import AsyncStorage from "@react-native-async-storage/async-storage";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { Stack } from "expo-router";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 30_000,
			gcTime: 24 * 60 * 60 * 1000, // 24h — precisa ser >= maxAge do persister
			retry: 2,
		},
		mutations: { retry: false },
	},
});

const persister = createAsyncStoragePersister({ storage: AsyncStorage });

export default function RootLayout() {
	return (
		<PersistQueryClientProvider
			client={queryClient}
			persistOptions={{ persister, maxAge: 24 * 60 * 60 * 1000 }}
		>
			<Stack />
		</PersistQueryClientProvider>
	);
}
