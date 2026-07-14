import { Image } from "expo-image";
import { useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";

export type ItemPhotoProps = {
	photoUrl: string;
	size?: "thumbnail" | "full";
	accessibilityLabel?: string;
};

export function ItemPhoto({
	photoUrl,
	size = "thumbnail",
	accessibilityLabel,
}: ItemPhotoProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [isError, setIsError] = useState(false);

	const imageStyle = [
		styles.image,
		size === "thumbnail" ? styles.thumbnail : styles.full,
	];

	if (!photoUrl || isError) {
		return (
			<View style={[...imageStyle, styles.placeholder]}>
				<ThemedText type="small">Sem foto</ThemedText>
			</View>
		);
	}

	return (
		<View style={imageStyle}>
			<Image
				source={{ uri: photoUrl }}
				accessibilityLabel={accessibilityLabel}
				contentFit="cover"
				onLoadStart={() => {
					setIsLoading(true);
					setIsError(false);
				}}
				onLoad={() => setIsLoading(false)}
				onError={() => {
					setIsLoading(false);
					setIsError(true);
				}}
				style={styles.imageAbsolute}
			/>

			{isLoading ? (
				<View style={styles.loadingOverlay}>
					<ActivityIndicator />
				</View>
			) : null}
		</View>
	);
}

const styles = StyleSheet.create({
	image: {
		borderRadius: 12,
		overflow: "hidden",
		backgroundColor: "#f0f0f0",
		justifyContent: "center",
		alignItems: "center",
	},

	imageAbsolute: {
		width: "100%",
		height: "100%",
	},

	thumbnail: {
		width: 80,
		height: 80,
	},

	full: {
		width: "100%",
		height: 260,
	},

	placeholder: {
		backgroundColor: "#e6e6e6",
	},

	loadingOverlay: {
		position: "absolute",
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		justifyContent: "center",
		alignItems: "center",
	},
});
