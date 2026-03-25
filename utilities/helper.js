export function validateOrder(data) {
    if (!data.customerName?.trim()) {
        return {
            valid: false,
            message: 'Customer name is required'
        }
    }
    if (!data.customerPhone?.trim()) {
        return {

            valid: false,
            message: 'Customer phone is required'

        }
    }
    if (!data.customerAddress?.trim()) {
        return {

            valid: false,
            message: 'Customer Address is required'

        }
    }
    if (!Array.isArray(data.items)) {
        return {
            valid: false,
            message: "place minimum 1 order"
        }
    }

    return {
        valid: true
    }
}


// order Id genenrator : formet => ORD-20260127-001
export function orderIdGenerator() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
    return `ORD-${year}${month}${day}${random}`

}

export function calculateTotal(items) {
    const subTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subTotal * 0.10;
    const deliveryFee = 35.00;
    const total = subTotal + tax + deliveryFee;

    return {
        subTotal: Math.round(subTotal * 100) / 100,
        tax: Math.round(tax * 100) / 100,
        deliveryFee,
        totalAmount: Math.round(total * 100) / 100
    }
}


export function createOrderDocument(orderData, orderId, totals) {
    return {
        orderId,
        customerName: orderData.customerName.trim(),
        customerPhone: orderData.customerPhone.trim(),
        customerAddress: orderData.customerAddress.trim(),
        items: orderData.items,
        subTotal: totals.subTotal,
        tax: totals.tax,
        specialNotes: orderData.specialNotes || '',
        paymentMethod: orderData.paymentMethod || "cash",
        paymentStatus: "pending",
        status: "pending",
        statusHistory: [{
            status: "pending",
            timestamp: new Date(),
            by: "customer",
            note: "Order Placed"
        }],
        estimatedTime: null,
        cratedAt: new Date(),
        updatedAt: new Date(),
    };



}


export function isValidStatus(currentStatus, newStatus) {
    const validTransition ={
        "pending":["confirmed" , "cancelled"],
        "confirmed": ["preparing" , "cancelled"],
        "preparing": ["ready" , "cancelled"],
        "ready": ["out_for_delivery" , "cancelled"],
        "out_for_delivery": ["delivered"],
        "delivered":[],
        "cancelled": []
    }
    return validTransition[currentStatus]?.includes(newStatus) || false;
}