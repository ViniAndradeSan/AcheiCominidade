import { focusManager } from "@tanstack/react-query";
import { useEffect } from "react";
import { AppState, type AppStateStatus } from "react-native";

export function useReactQueryFocusManager() {
	useEffect(() => {
		function onAppStateChange(status: AppStateStatus) {
			focusManager.setFocused(status === "active");
		}

		const subscription = AppState.addEventListener("change", onAppStateChange);

		return () => subscription.remove();
	}, []);
}
