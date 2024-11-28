import CryptoJS from "crypto-js";
import { Donation } from "./types";

const ENCRYPTION_KEY = process.env.EXPO_PUBLIC_ENCRYPT_KEY;

// Decrypt encrypted data (Details, Type, Image URLs)
const decryptData = (encryptedData: string): string => {
	if (!ENCRYPTION_KEY) {
		console.error("Encryption key is missing.");
		return "";
	}
	const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
	return bytes.toString(CryptoJS.enc.Utf8); // Convert to UTF-8 string
};

const decryptDonations = (donations: Donation[]) => {
	const decryptedDonations = donations.map((donation) => ({
		...donation,
		type: decryptData(donation.type),
		details: decryptData(donation.details),
		images: donation.images.map((imageUrl) => decryptData(imageUrl)),
	}));

	return decryptedDonations;
};

export { decryptData, decryptDonations };
