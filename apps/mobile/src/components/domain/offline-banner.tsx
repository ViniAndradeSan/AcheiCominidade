import { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";

import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { useNetworkStatus } from "@/hooks/use-network-status";
import { useTheme } from "@/hooks/use-theme";

export function OfflineBanner() {
	const isOnline = useNetworkStatus();
	const theme = useTheme();
	const height = useSharedValue(0);

	useEffect(() => {
		height.value = withTiming(isOnline ? 0 : 32, { duration: 200 });
	}, [isOnline, height]);

	const animatedStyle = useAnimatedStyle(() => ({ height: height.value }));

	return (
		<Animated.View
			style={[
				styles.container,
				{ backgroundColor: theme.danger },
				animatedStyle,
			]}
		>
			<ThemedText type="smallBold" style={{ color: "#FFFFFF" }}>
				Sem conexão com a internet
			</ThemedText>
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	container: {
		overflow: "hidden",
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: Spacing.two,
	},
});
