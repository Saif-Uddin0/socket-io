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
            message: 'Custome Address is required'

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