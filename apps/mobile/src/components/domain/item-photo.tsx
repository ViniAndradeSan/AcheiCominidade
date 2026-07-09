import { Image } from "expo-image";
import { StyleSheet } from "react-native";

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
	return (
		<Image
			source={{ uri: photoUrl }}
			accessibilityLabel={accessibilityLabel}
			contentFit="cover"
			style={[
				styles.image,
				size === "thumbnail" ? styles.thumbnail : styles.full,
			]}
		/>
	);
}

const styles = StyleSheet.create({
	image: {
		borderRadius: 12,
	},

	thumbnail: {
		width: 80,
		height: 80,
	},

	full: {
		width: "100%",
		height: 260,
	},
});
