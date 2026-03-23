import { getCollection } from "../config/database.js";
import { calculateTotal, createOrderDocument, orderIdGenerator } from "../utilities/helper.js";

export const orderHandler =(io, socket)=>{
    console.log("a user is connected" , socket.id);

    // place a order
    socket.on("placeOrder", async(data , callback)=>{
        try{
            console.log(`place order from ${socket.id}`)
            const validation = validateOrder(data);
            if(!validation.valid){
                return callback({
                    success: false,
                    message: validation.message
                })
            }
            const totals = calculateTotal(data.items);
            const orderId = orderIdGenerator();
            const order = createOrderDocument(data, orderId , totals);
            const ordersCollection = getCollection("orders");
            await ordersCollection.insertOne(order);

             socket.join(`order-${orderId}`);
             socket.join(`customers'`);

             io.to('admins').emit('newOrder' , {order})

             callback({success: true , order})
             console.log(`order created: ${orderId}`);
             
            
        }catch(error){
            console.log(error);
            callback({success: false , message: "Faileeed to place order"})
        }
    })
    
}