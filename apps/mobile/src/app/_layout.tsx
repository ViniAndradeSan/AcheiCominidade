import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { Stack } from "expo-router";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";

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
	const scheme = useColorScheme();
	const navTheme = scheme === "dark"
		? { ...DarkTheme, colors: { ...DarkTheme.colors, background: Colors.dark.background, card: Colors.dark.background, text: Colors.dark.text, border: Colors.dark.border } }
		: { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: Colors.light.background, card: Colors.light.background, text: Colors.light.text, border: Colors.light.border } };

	return (
		<PersistQueryClientProvider
			client={queryClient}
			persistOptions={{ persister, maxAge: 24 * 60 * 60 * 1000 }}
		>
			<ThemeProvider value={navTheme}>
				<Stack screenOptions={{ headerShadowVisible: false }} />
			</ThemeProvider>
		</PersistQueryClientProvider>
	);
}
