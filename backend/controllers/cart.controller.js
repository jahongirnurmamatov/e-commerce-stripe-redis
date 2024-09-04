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