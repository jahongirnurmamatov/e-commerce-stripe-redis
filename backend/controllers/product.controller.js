import Product from "../models/product.model.js"

export const getAllProducts = async(req,res)=>{
    try {
        const products = await Product.find({});


    } catch (error) {
        console.log('error in receiving products ',error);
        res.status(500).json(error);
    }
}