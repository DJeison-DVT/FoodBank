enum OrderStatus {
	BeingModified = "BeingModified", // Initial status
	NeedsToBeChecked = "NeedsToBeChecked", // Donations are invalid
	NeedsToBeVerified = "NeedsToBeVerified", // Waiting for staff verification
	Verified = "Verified", // Approved
	Scheduled = "Scheduled", // Pickup scheduled
	PickedUp = "PickedUp", // Items collected, Order completed
}

const OrderStatusTranslations: { [key in OrderStatus]: string } = {
	[OrderStatus.BeingModified]: "En modificación", // Initial status
	[OrderStatus.NeedsToBeChecked]:
		"Pendiente de revisión (artículos inválidos)", // Donations are invalid
	[OrderStatus.NeedsToBeVerified]: "Pendiente de verificación", // Waiting for staff verification
	[OrderStatus.Verified]: "Verificado (aprobado)", // Approved
	[OrderStatus.Scheduled]: "Recolecta programada", // Pickup scheduled
	[OrderStatus.PickedUp]: "Recolecta completada", // Items collected, Order completed
};

// Function to get the translated status
function translateOrderStatus(status: string): string {
	const statusKey = status as OrderStatus;
	return OrderStatusTranslations[statusKey] || "Estado desconocido"; // Fallback for unknown statuses
}

export { OrderStatus, translateOrderStatus };
