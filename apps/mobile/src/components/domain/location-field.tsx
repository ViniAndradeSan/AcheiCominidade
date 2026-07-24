import { Feather } from "@expo/vector-icons";
import { useCallback, useRef, useState } from "react";
import {
	ActivityIndicator,
	Pressable,
	ScrollView,
	StyleSheet,
	TextInput,
	View,
} from "react-native";
import { ThemedText } from "@/components/themed-text";
import { Radius, Spacing } from "@/constants/theme";
import { useAddressAutocomplete } from "@/hooks/use-address-autocomplete";
import type { GeocodingSuggestion } from "@/lib/api/geocoding";
import { useTheme } from "@/hooks/use-theme";

export type LocationFieldProps = {
	value: string;
	onChangeText: (text: string) => void;
	onUseCurrentLocation: () => void;
	onSelectSuggestion: (suggestion: GeocodingSuggestion) => void;
	loadingLocation?: boolean;
	coordinatesCaptured?: boolean;
};

export function LocationField({
	value,
	onChangeText,
	onUseCurrentLocation,
	onSelectSuggestion,
	loadingLocation,
	coordinatesCaptured,
}: LocationFieldProps) {
	const theme = useTheme();
	const [isFocused, setIsFocused] = useState(false);
	const blurTimeout = useRef<ReturnType<typeof setTimeout>>(null);

	const { data: suggestions = [], isLoading: loadingSuggestions } =
		useAddressAutocomplete(value);

	const showDropdown = isFocused && suggestions.length > 0;

	const handleFocus = useCallback(() => {
		setIsFocused(true);
	}, []);

	const handleBlur = useCallback(() => {
		blurTimeout.current = setTimeout(() => setIsFocused(false), 150);
	}, []);

	const handleSelect = useCallback(
		(s: GeocodingSuggestion) => {
			if (blurTimeout.current) clearTimeout(blurTimeout.current);
			onChangeText(s.displayName);
			onSelectSuggestion(s);
			setIsFocused(false);
		},
		[onChangeText, onSelectSuggestion],
	);

	return (
		<View style={styles.container}>
			<ThemedText type="smallBold">Local encontrado</ThemedText>

			<View style={styles.row}>
				<TextInput
					value={value}
					onChangeText={onChangeText}
					onFocus={handleFocus}
					onBlur={handleBlur}
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
					accessibilityLabel="use-current-location"
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
						<Feather name="map-pin" size={18} color={theme.text} />
					)}
				</Pressable>
			</View>

			{showDropdown && (
				<View
					style={[
						styles.suggestions,
						{
							backgroundColor: theme.backgroundElevated,
							borderColor: theme.border,
						},
					]}
				>
					<ScrollView keyboardShouldPersistTaps="handled">
						{suggestions.map((s) => (
							<Pressable
								key={`${s.latitude}-${s.longitude}`}
								onPress={() => handleSelect(s)}
								style={styles.suggestionRow}
							>
								<Feather
									name="map-pin"
									size={14}
									color={theme.textSecondary}
								/>
								<ThemedText
									type="small"
									numberOfLines={2}
									style={{ flex: 1 }}
								>
									{s.displayName}
								</ThemedText>
							</Pressable>
						))}
					</ScrollView>
				</View>
			)}

			{loadingSuggestions && isFocused && !showDropdown && (
				<ActivityIndicator
					size="small"
					color={theme.textSecondary}
					style={styles.loadingIndicator}
				/>
			)}

			{coordinatesCaptured && (
				<ThemedText type="small" style={styles.captured}>
					Coordenada capturada
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
		borderRadius: Radius.md,
		paddingHorizontal: Spacing.three,
		paddingVertical: Spacing.two,
		fontSize: 16,
	},
	gpsButton: {
		width: 48,
		height: 48,
		borderRadius: Radius.md,
		alignItems: "center",
		justifyContent: "center",
	},
	suggestions: {
		position: "absolute",
		top: 56,
		left: 0,
		right: 0,
		zIndex: 10,
		elevation: 4,
		borderWidth: 1,
		borderRadius: Radius.md,
		maxHeight: 220,
		overflow: "hidden",
	},
	suggestionRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: Spacing.two,
		paddingHorizontal: Spacing.three,
		paddingVertical: Spacing.two,
	},
	loadingIndicator: {
		marginTop: Spacing.half,
	},
	captured: {
		marginTop: Spacing.half,
	},
});
