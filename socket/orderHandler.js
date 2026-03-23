export const orderHandler =(io, socket)=>{
    console.log("a user is connected" , socket.id);

    // place a order
    socket.on("placeOrder", async(data , callback)=>{
        try{
            console.log(`place order from ${socket.id}`)
            const validation = validateOrder(data);
            if(!validation.valid){
                callback({
                    success: false,
                    message: validation.message
                })
            }
            
        }catch(error){
            console.log(error);
            
        }
    })
    
}