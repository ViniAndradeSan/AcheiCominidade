import { useEffect } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
	useSharedValue,
	withTiming,
	useAnimatedStyle,
} from "react-native-reanimated";

import { ThemedText } from "@/components/themed-text";
import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

type Status = "disponivel" | "devolvido";

type StatusFilterTabsProps = {
	value: Status;
	onChange: (status: Status) => void;
};

const TAB_COUNT = 2;

export function StatusFilterTabs({ value, onChange }: StatusFilterTabsProps) {
	const theme = useTheme();
	const translateX = useSharedValue(value === "disponivel" ? 0 : 1);

	useEffect(() => {
		translateX.value = withTiming(value === "disponivel" ? 0 : 1, {
			duration: 200,
		});
	}, [value, translateX]);

	const pillStyle = useAnimatedStyle(() => ({
		transform: [{ translateX: `${translateX.value * 100}%` }],
	}));

	return (
		<View
			style={[
				styles.container,
				{ backgroundColor: theme.backgroundElement, borderRadius: Radius.md },
			]}
		>
			<Animated.View
				style={[
					styles.pill,
					pillStyle,
					{ backgroundColor: theme.primary, borderRadius: Radius.md },
				]}
			/>

			<Pressable
				onPress={() => onChange("disponivel")}
				style={styles.tab}
			>
				<ThemedText
					type={value === "disponivel" ? "smallBold" : "small"}
					style={{ color: value === "disponivel" ? theme.primaryText : theme.text }}
				>
					Disponíveis
				</ThemedText>
			</Pressable>

			<Pressable
				onPress={() => onChange("devolvido")}
				style={styles.tab}
			>
				<ThemedText
					type={value === "devolvido" ? "smallBold" : "small"}
					style={{ color: value === "devolvido" ? theme.primaryText : theme.text }}
				>
					Devolvidos
				</ThemedText>
			</Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		marginVertical: Spacing.two,
	},

	pill: {
		...StyleSheet.absoluteFillObject,
		width: `${100 / TAB_COUNT}%`,
	},

	tab: {
		flex: 1,
		paddingVertical: Spacing.two,
		alignItems: "center",
		justifyContent: "center",
	},
});
