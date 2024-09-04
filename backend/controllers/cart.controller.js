import Product from "../models/product.model.js";

export const addToCart = async(req,res)=>{
     try {
        const {productId}=req.body;
        const user=req.user;
        const existingItem = user.cartitems.find(item=>item.id===productId);

        if(existingItem){
            existingItem.quantity+=1;
        }else{
            user.cartitems.push(productId);
        }
        await user.save();
        res.json(user.cartitems);
     } catch (error) {
        console.log('Error in adding to cart');
        res.status(500).json({message:'Server error',error:error.message});
     }
}
export const removeAllFromCart = async(req,res)=>{
    try {
       const {productId}=req.body;
       const user=req.user;
       if(!productId){
        user.cartitems=[];
       }else{
        user.cartitems = user.cartitems.filter((item)=>item.id!==productId);
       }
       await user.save();
    } catch (error) {
       console.log('Error in removing from cart');
       res.status(500).json({message:'Server error',error:error.message});
    }
}

export const updateQuantity =async (req,res)=>{
    try {
        const {id:productId}=req.params;
        const {quantity}=req.params;
        const user = req.user;
        const existingItem = user.cartitems.find((item)=>item.id===productId);

        if(existingItem){
            if(quantity===0){
                user.cartitems = user.cartitems.filter(item=>item.id!==productId);
                await user.save();
                return res.json(user.cartitems);
            }

            existingItem.quantity=quantity;
            await user.save();
            res.json(user.cartitems);
        }else{
            res.status(404).json({message:'Product not found!'});
        }
    } catch (error) {
        console.log('Error in updating quanatity');
        res.status(500).json({message:'Server error',error:error.message});
    }
}

export const getCartProducts =async(req,res)=>{
    try {
        const products = await Product.find({_id:{$in:req.user.cartitems}});

        //add quantity for each product
        const cartItems = products.map(product =>{
            const item = req.user.cartitems.find(cartItem => cartItem.id===product.id);
            return {...product.toJSON(), quantity:item.quantity}
        });

        res.json(cartitems);
       
    } catch (error) {
        console.log('Error in getting cart products');
        res.status(500).json('Server error');
    }
}