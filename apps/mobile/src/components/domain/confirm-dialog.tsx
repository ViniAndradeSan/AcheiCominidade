import { Modal, StyleSheet, View } from "react-native";
import { Button } from "@/components/ui/button";
import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

type ConfirmDialogProps = {
	visible: boolean;
	title: string;
	message: string;
	onConfirm: () => void;
	onCancel: () => void;
	confirmText?: string;
	cancelText?: string;
};

export function ConfirmDialog({
	visible,
	title,
	message,
	onConfirm,
	onCancel,
	confirmText = "Confirmar",
	cancelText = "Cancelar",
}: ConfirmDialogProps) {
	const theme = useTheme();

	return (
		<Modal
			visible={visible}
			transparent
			animationType="fade"
			onRequestClose={onCancel}
		>
			<View style={styles.overlay}>
				<View style={[styles.dialog, { backgroundColor: theme.background }]}>
					<ThemedText type="subtitle" style={styles.title}>
						{title}
					</ThemedText>

					<ThemedText type="default" style={styles.message}>
						{message}
					</ThemedText>

					<View style={styles.buttons}>
						<Button
							label={cancelText}
							variant="ghost"
							onPress={onCancel}
						/>

						<Button
							label={confirmText}
							variant="danger"
							onPress={onConfirm}
						/>
					</View>
				</View>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.5)",
		justifyContent: "center",
		alignItems: "center",
		padding: Spacing.four,
	},

	dialog: {
		width: "100%",
		borderRadius: 12,
		padding: Spacing.four,
	},

	title: {
		marginBottom: Spacing.two,
	},

	message: {
		marginBottom: Spacing.three,
	},

	buttons: {
		flexDirection: "row",
		justifyContent: "flex-end",
		gap: Spacing.two,
	},
});
