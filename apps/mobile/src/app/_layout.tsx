import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { Stack } from "expo-router";
import { useReactQueryFocusManager } from "@/lib/query/focus-manager";
import { setupReactQueryOnlineManager } from "@/lib/query/online-manager";
import { OfflineBanner } from "@/components/domain/offline-banner";

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

setupReactQueryOnlineManager();

export default function RootLayout() {
	useReactQueryFocusManager();

	return (
		<PersistQueryClientProvider
			client={queryClient}
			persistOptions={{ persister, maxAge: 24 * 60 * 60 * 1000 }}
		>
			<OfflineBanner />
			<Stack />
		</PersistQueryClientProvider>
	);
}
