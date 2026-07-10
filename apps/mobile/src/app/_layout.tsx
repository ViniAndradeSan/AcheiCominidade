import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: { staleTime: 30_000, retry: 2 },
		mutations: { retry: false },
	},
});

export default function RootLayout() {
	return (
		<QueryClientProvider client={queryClient}>
			<Stack />
		</QueryClientProvider>
	);
}
