interface Donation {
	ID: number;
	CreatedAt: string;
	UpdatedAt: string;
	DeletedAt: string | null;
	OrderID: number;
	Type: string;
	Details: string;
	Images: string[];
	Status: string;
}

interface Order {
	ID: number;
	UserID: string;
	Status: string;
	Donations: Donation[];
	VerificationQRCode?: string;
	PickupDate?: string;
	PickupTime?: string;
	CreatedAt: string;
	UpdatedAt: string;
	DeletedAt: string | null;
}
