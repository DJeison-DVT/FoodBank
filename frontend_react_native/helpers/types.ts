import { UserData } from "./auth";

interface Donation {
	ID: number;
	CreatedAt: string;
	UpdatedAt: string;
	DeletedAt: string | null;
	order_id: number;
	type: string;
	details: string;
	images: string[];
	status: string;
}

interface Order {
	ID: number;
	user_id: string;
	status: string;
	donations: Donation[];
	VerificationQRCode?: string;
	PickupDate?: string;
	PickupTime?: string;
	CreatedAt: string;
	UpdatedAt: string;
	DeletedAt: string | null;
}

interface StaffOrder extends Order {
	user: UserData;
}

export { Donation, Order, StaffOrder };
