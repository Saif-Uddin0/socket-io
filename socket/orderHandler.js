import { Timestamp } from "mongodb";
import { getCollection } from "../config/database.js";
import { calculateTotal, createOrderDocument, orderIdGenerator } from "../utilities/helper.js";

export const orderHandler = (io, socket) => {
    console.log("a user is connected", socket.id);

    // place a order
    socket.on("placeOrder", async (data, callback) => {
        try {
            console.log(`place order from ${socket.id}`)
            const validation = validateOrder(data);
            if (!validation.valid) {
                return callback({
                    success: false,
                    message: validation.message
                })
            }
            const totals = calculateTotal(data.items);
            const orderId = orderIdGenerator();
            const order = createOrderDocument(data, orderId, totals);
            const ordersCollection = getCollection("orders");
            await ordersCollection.insertOne(order);

            socket.join(`order-${orderId}`);
            socket.join(`customers`);

            io.to('admins').emit('newOrder', { order });

            callback({ success: true, order });
            console.log(`order created: ${orderId}`);


        } catch (error) {
            console.log(error);
            callback({ success: false, message: "Failed to place order" })
        }
    });


    // track order
    socket.on("trackOrder", async (data, callback) => {
        try {
            const orderCollection = getCollection('orders');
            const order = await orderCollection.findOne({ orderId: data.orderId });
            if (!order) {
                return callback({ success: false, message: "Order Not Found" })
            }

            socket.join(`order-${data.orderId}`);
            callback({ success: true, order });
        } catch (error) {
            console.log("order tracking error", error)
            callback({ success: false, message: error.message })

        }
    })


    // cancel Order
    socket.on("cancelledOrder", async (data, callback) => {
        try {
            const orderCollection = getCollection('orders');
            const order = await orderCollection.findOne({ orderId: data.orderId });
            if (!order) {
                return callback({ success: false, message: "Order Not Found" })
            }
            if (['pending', 'confirmed'].includes(order.status)) {
                return callback({ success: false, message: "cann't cancelled this order" });
            }
            await orderCollection.updateOne(
                { orderId: data.orderId },
                {
                    $set: { status: 'cancelled', updatedAt: new Date() },
                    $push: {
                        statusHistory: {
                            status: 'cancelled',
                            timestamp: new Date(),
                            by: socket.id,
                            note: data.reason || "Cancelled by customer"
                        }
                    }
                },
            )


            io.to(`order-${data.orderId}`).emit('orderCancelled', { orderID: data.orderId });

        } catch (error) {

        }
    })
}