import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

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
	return (
		<Modal
			visible={visible}
			transparent
			animationType="fade"
			onRequestClose={onCancel}
		>
			<View style={styles.overlay}>
				<View style={styles.dialog}>
					<Text style={styles.title}>{title}</Text>

					<Text style={styles.message}>{message}</Text>

					<View style={styles.buttons}>
						<Pressable
							style={[styles.button, styles.cancelButton]}
							onPress={onCancel}
						>
							<Text>{cancelText}</Text>
						</Pressable>

						<Pressable
							style={[styles.button, styles.confirmButton]}
							onPress={onConfirm}
						>
							<Text style={styles.confirmText}>{confirmText}</Text>
						</Pressable>
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
		padding: 24,
	},

	dialog: {
		width: "100%",
		backgroundColor: "#fff",
		borderRadius: 12,
		padding: 20,
	},

	title: {
		fontSize: 18,
		fontWeight: "700",
		marginBottom: 12,
	},

	message: {
		fontSize: 16,
		marginBottom: 20,
	},

	buttons: {
		flexDirection: "row",
		justifyContent: "flex-end",
		gap: 12,
	},

	button: {
		paddingHorizontal: 16,
		paddingVertical: 10,
		borderRadius: 8,
	},

	cancelButton: {
		backgroundColor: "#E5E7EB",
	},

	confirmButton: {
		backgroundColor: "#DC2626",
	},

	confirmText: {
		color: "#FFF",
		fontWeight: "600",
	},
});
