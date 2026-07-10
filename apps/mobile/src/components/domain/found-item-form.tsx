import { useRouter } from "expo-router";
import { useState } from "react";
import {
	ActivityIndicator,
	Image,
	Pressable,
	ScrollView,
	StyleSheet,
	TextInput,
	View,
} from "react-native";
import { CategoryPicker } from "@/components/domain/category-picker";
import { LocationField } from "@/components/domain/location-field";
import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { useCategories } from "@/hooks/use-categories";
import { useCreateFoundItem } from "@/hooks/use-create-found-item";
import { useUpdateFoundItem } from "@/hooks/use-update-found-item";
import { useImagePicker } from "@/hooks/use-image-picker";
import { useLocation } from "@/hooks/use-location";
import { useTheme } from "@/hooks/use-theme";
import { buildPhotoDataUri } from "@/lib/upload/upload-image";
import type { FoundItem } from "@/lib/types";

type FoundItemFormProps = {
	mode?: "create" | "edit";
	initialValues?: FoundItem;
};

export function FoundItemForm({
	mode = "create",
	initialValues,
}: FoundItemFormProps) {
	const router = useRouter();
	const theme = useTheme();

	const {
		image,
		error: imageError,
		pickFromCamera,
		pickFromGallery,
		clear: clearImage,
	} = useImagePicker();

	const {
		latitude,
		longitude,
		loading: locationLoading,
		error: locationError,
		captureCurrentLocation,
	} = useLocation();

	const { data: categories, isLoading: categoriesLoading } =
		useCategories();

	const createMutation = useCreateFoundItem();
    const updateMutation = useUpdateFoundItem();

    const isPending =
	mode === "edit"
		? updateMutation.isPending
		: createMutation.isPending;

	const [title, setTitle] = useState(initialValues?.title ?? "");
	const [description, setDescription] = useState(
		initialValues?.description ?? "",
	);
	const [categoryId, setCategoryId] = useState<string | null>(
		initialValues?.categoryId ?? null,
	);
	const [locationText, setLocationText] = useState(
		initialValues?.foundLocationText ?? "",
	);

	async function handleUseCurrentLocation() {
		const addr = await captureCurrentLocation();
		if (addr) setLocationText(addr);
	}

	const canSubmit =
		title.trim().length > 0 &&
		categoryId !== null &&
		(mode === "edit" || image !== null) &&
		locationText.trim().length > 0 &&
		!isPending;

	function handleSubmit() {
		if (!canSubmit || !categoryId) return;

		const photoUrl =
			image != null
				? image.base64
					? buildPhotoDataUri(image.base64)
					: image.uri
				: initialValues?.photoUrl;

		const payload = {
			title: title.trim(),
			description: description.trim() || undefined,
			categoryId,
			photoUrl: photoUrl!,
			foundLocationText: locationText.trim(),
			foundLatitude: latitude ?? undefined,
			foundLongitude: longitude ?? undefined,
		};

		if (mode === "edit" && initialValues) {
			updateMutation.mutate(
				{
				id: initialValues.id,
				input: payload,
				},
				{
					onSuccess: () => {
						if (
							typeof window !== "undefined" &&
							window.history.length > 1
						) {
							router.back();
						} else {
							router.replace("/");
						}
					},
				},
			);
		} else {
			createMutation.mutate(payload, {
				onSuccess: () => {
					if (
						typeof window !== "undefined" &&
						window.history.length > 1
					) {
						router.back();
					} else {
						router.replace("/");
					}
				},
			});
		}
	}

		return (
		<ScrollView
			contentContainerStyle={styles.container}
			keyboardShouldPersistTaps="handled"
		>
			<ThemedText type="smallBold">Foto do item</ThemedText>

			<View style={styles.photoRow}>
				<Pressable
					onPress={pickFromCamera}
					style={[
						styles.photoButton,
						{ backgroundColor: theme.backgroundElement },
					]}
				>
					<ThemedText type="small">Câmera</ThemedText>
				</Pressable>

				<Pressable
					onPress={pickFromGallery}
					style={[
						styles.photoButton,
						{ backgroundColor: theme.backgroundElement },
					]}
				>
					<ThemedText type="small">Galeria</ThemedText>
				</Pressable>

				{image && (
					<Pressable
						onPress={clearImage}
						style={styles.clearButton}
					>
						<ThemedText type="small">✕</ThemedText>
					</Pressable>
				)}
			</View>

			{image ? (
				<Image source={{ uri: image.uri }} style={styles.preview} />
			) : (
				mode === "edit" &&
				initialValues?.photoUrl && (
					<Image
						source={{ uri: initialValues.photoUrl }}
						style={styles.preview}
					/>
				)
			)}

			{imageError && (
				<ThemedText type="small" style={{ color: "#E53935" }}>
					{imageError}
				</ThemedText>
			)}

			<ThemedText type="smallBold">Título</ThemedText>

			<TextInput
				value={title}
				onChangeText={setTitle}
				placeholder="Ex.: Reator termonuclear, fone de ouvido..."
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

			<ThemedText type="smallBold">
				Descrição (opcional)
			</ThemedText>

			<TextInput
				value={description}
				onChangeText={setDescription}
				placeholder="Detalhes adicionais..."
				placeholderTextColor={theme.textSecondary}
				multiline
				numberOfLines={3}
				style={[
					styles.input,
					styles.textArea,
					{
						color: theme.text,
						backgroundColor: theme.backgroundElement,
						borderColor: theme.backgroundSelected,
					},
				]}
			/>

			<ThemedText type="smallBold">Categoria</ThemedText>

			<CategoryPicker
				categories={categories ?? []}
				value={categoryId}
				onChange={setCategoryId}
				loading={categoriesLoading}
			/>

			<LocationField
				value={locationText}
				onChangeText={setLocationText}
				onUseCurrentLocation={handleUseCurrentLocation}
				loadingLocation={locationLoading}
				coordinatesCaptured={
					latitude !== null && longitude !== null
				}
			/>

			{locationError && (
				<ThemedText type="small" style={{ color: "#E53935" }}>
					{locationError}
				</ThemedText>
			)}

			<Pressable
				onPress={handleSubmit}
				disabled={!canSubmit}
				style={[
					styles.submitButton,
					{ backgroundColor: theme.backgroundElement },
					!canSubmit && { opacity: 0.5 },
				]}
			>
				{isPending ? (
					<ActivityIndicator
						color={theme.text}
						size="small"
					/>
				) : (
					<ThemedText type="smallBold">
						{mode === "edit"
							? "Salvar alterações"
							: "Registrar"}
					</ThemedText>
				)}
			</Pressable>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		padding: Spacing.three,
		gap: Spacing.two,
		paddingBottom: Spacing.six,
	},
	photoRow: {
		flexDirection: "row",
		gap: Spacing.two,
	},
	photoButton: {
		flex: 1,
		paddingVertical: Spacing.three,
		borderRadius: Spacing.two,
		alignItems: "center",
	},
	clearButton: {
		paddingHorizontal: Spacing.three,
		justifyContent: "center",
	},
	preview: {
		width: "100%",
		height: 200,
		borderRadius: Spacing.two,
		resizeMode: "cover",
	},
	input: {
		borderWidth: 1,
		borderRadius: Spacing.two,
		paddingHorizontal: Spacing.three,
		paddingVertical: Spacing.two,
		fontSize: 16,
	},
	textArea: {
		minHeight: 80,
		textAlignVertical: "top",
	},
	submitButton: {
		marginTop: Spacing.two,
		paddingVertical: Spacing.three,
		borderRadius: Spacing.two,
		alignItems: "center",
	},
});