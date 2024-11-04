import AsyncStorage from "@react-native-async-storage/async-storage";

export interface UserData {
	role: string;
	name: string;
	email: string;
	picture?: string;
	address?: string;
}

// Fetches user information using the JWT token stored in AsyncStorage
export const fetchUserInfo = async (): Promise<UserData | undefined> => {
	try {
		const jwtToken = await AsyncStorage.getItem("jwt_token");
		if (jwtToken === null) {
			console.error("No JWT token found");
			return;
		}

		const userId = await AsyncStorage.getItem("user_id");
		if (userId === null) {
			console.error("No user ID found");
			return;
		}

		console.log("JWT token:", jwtToken);
		console.log("User ID:", userId);

		console.log("Fetching user info...");
		// Send request with JWT in Authorization header
		const res = await fetch(`http://localhost:8080/users?id=${userId}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${jwtToken}`,
			},
		});
		if (!res.ok) {
			console.error("Failed to fetch user info:", res.statusText);
			return;
		}
		const data = await res.json();
		console.log("User info:", data);

		return data as UserData;
	} catch (error) {
		console.error("Error fetching user info:", error);
	}
};

export const deleteJwtToken = async () => {
	try {
		await AsyncStorage.removeItem("jwt_token");
		await AsyncStorage.removeItem("user_id");
		console.log("JWT token deleted");
	} catch (error) {
		console.error("Error deleting JWT token:", error);
	}
};
