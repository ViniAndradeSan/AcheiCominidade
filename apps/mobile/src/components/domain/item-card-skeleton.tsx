import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
	useSharedValue,
	withRepeat,
	withTiming,
	useAnimatedStyle,
} from "react-native-reanimated";

import { Radius, Shadows, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

const SHIMMER_DURATION = 1200;

function ShimmerBar({
	style,
	theme,
}: {
	style?: object;
	theme: ReturnType<typeof useTheme>;
}) {
	const opacity = useSharedValue(0.5);

	useEffect(() => {
		opacity.value = withRepeat(
			withTiming(1, { duration: SHIMMER_DURATION }),
			-1,
			true,
		);
	}, [opacity]);

	const animatedStyle = useAnimatedStyle(() => ({
		opacity: opacity.value,
	}));

	return (
		<Animated.View
			style={[style, { backgroundColor: theme.backgroundElement }, animatedStyle]}
		/>
	);
}

export function ItemCardSkeleton() {
	const theme = useTheme();

	return (
		<View style={[styles.card, Shadows.sm, { backgroundColor: theme.backgroundElevated }]}>
			<ShimmerBar style={styles.photo} theme={theme} />
			<View style={styles.content}>
				<ShimmerBar style={[styles.line, styles.lineWide]} theme={theme} />
				<ShimmerBar style={[styles.line, styles.lineChip]} theme={theme} />
				<ShimmerBar style={[styles.line, styles.lineNarrow]} theme={theme} />
			</View>
		</View>
	);
}

export function ItemListSkeleton({ count = 6 }: { count?: number }) {
	return (
		<View>
			{Array.from({ length: count }).map((_, i) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: lista estática de skeletons, ordem nunca muda
				<ItemCardSkeleton key={i} />
			))}
		</View>
	);
}

const styles = StyleSheet.create({
	card: { flexDirection: "row", gap: Spacing.three, padding: Spacing.three },
	photo: { width: 64, height: 64, borderRadius: Radius.md },
	content: { flex: 1, justifyContent: "center", gap: Spacing.two },
	line: { height: 12, borderRadius: 4 },
	lineWide: { width: "80%" },
	lineChip: { width: "40%", height: 20, borderRadius: Radius.md },
	lineNarrow: { width: "60%" },
});
