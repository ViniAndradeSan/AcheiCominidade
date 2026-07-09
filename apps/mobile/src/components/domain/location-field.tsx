import {
	ActivityIndicator,
	Pressable,
	StyleSheet,
	TextInput,
	View,
} from "react-native";
import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

export type LocationFieldProps = {
	value: string;
	onChangeText: (text: string) => void;
	onUseCurrentLocation: () => void;
	loadingLocation?: boolean;
	coordinatesCaptured?: boolean;
};

export function LocationField({
	value,
	onChangeText,
	onUseCurrentLocation,
	loadingLocation,
	coordinatesCaptured,
}: LocationFieldProps) {
	const theme = useTheme();

	return (
		<View style={styles.container}>
			<ThemedText type="smallBold">Local encontrado</ThemedText>

			<View style={styles.row}>
				<TextInput
					value={value}
					onChangeText={onChangeText}
					placeholder="Ex.: Bloco Y, 7º andar, sala 693"
					placeholderTextColor={theme.textSecondary}
					style={[
						styles.input,
						{
							color: theme.text,
							backgroundColor: theme.backgroundElement,
							borderColor: theme.backgroundSelected,
						},
					]}
				/>

				<Pressable
					onPress={onUseCurrentLocation}
					disabled={loadingLocation}
					style={[
						styles.gpsButton,
						{ backgroundColor: theme.backgroundElement },
					]}
				>
					{loadingLocation ? (
						<ActivityIndicator size="small" color={theme.text} />
					) : (
						<ThemedText type="small">📍</ThemedText>
					)}
				</Pressable>
			</View>

			{coordinatesCaptured && (
				<ThemedText type="small" style={styles.captured}>
					📍 Coordenada capturada
				</ThemedText>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		gap: Spacing.one,
	},
	row: {
		flexDirection: "row",
		gap: Spacing.two,
		alignItems: "center",
	},
	input: {
		flex: 1,
		borderWidth: 1,
		borderRadius: Spacing.two,
		paddingHorizontal: Spacing.three,
		paddingVertical: Spacing.two,
		fontSize: 16,
	},
	gpsButton: {
		width: 48,
		height: 48,
		borderRadius: Spacing.two,
		alignItems: "center",
		justifyContent: "center",
	},
	captured: {
		marginTop: Spacing.half,
	},
});
