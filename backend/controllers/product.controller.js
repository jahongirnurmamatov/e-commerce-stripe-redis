
import cloudinary from "../lib/cloudinary.js";
import { redis } from "../lib/redis.js";

import Product from "../models/product.model.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    console.log("error in receiving products ", error);
    res.status(500).json(error);
  }
};


export const getFeaturedProducts = async (req, res) => {
  try {
    let featuredProducts = await redis.get("featured_products");

    if (featuredProducts) {
      return res.json(JSON.parse(featuredProducts));
    }
    featuredProducts = await Product.find({ isFeatured: true }).lean();

    if (!featuredProducts) {
      return res.status(404).json({ message: "No featured products found!" });
    }

    //store in redis for future quick access
    await redis.set("featured_products", JSON.stringify(featuredProducts));
    res.json(featuredProducts);
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal server error");
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, category } = req.body;

    let cloudinaryResponse = null;
    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "products",
      });
    }
    const product = await Product.create({
      name,
      description,
      price,
      image: cloudinaryResponse?.secure_url
        ? cloudinaryResponse?.secure_url
        : "",
      category,
    });

    res.status(201).json(product);
  } catch (error) {
    console.log("error in product creating", error.message);
    res.status(500).json({ message: "Server error, ", error: error.message });
  }
};

export const deleteProduct = async(req,res)=>{
    try {
        const product = await Product.findById(req.params.id);
        if(!product){
            return res.status(404).json({message:'Product not found!'});
        }
        if(product.image){
            const publicId=product.image('/').pop().split('.')[0];
            try {
                await cloudinary.uploader.destroy(`products/${publicId}`);
                console.log('deleted image from cloudinary');
            } catch (error) {
                console.log('errorn in deleting image from cloudinary');
            }
        }
        await Product.findByIdAndDelete(req.params.id);
        res.json('Product deleted successfully');
    } catch (error) {
        console.log(error.message);
        res.status(500).json('Internal server error, ',error.message);
    }
}

export const getRecommendedProducts = async (req,res)=>{
    try {
        const products = Product.aggregate([
            {
                $sample:{size:3}
            },
            {
                $project:{
                    _id:1,
                    name:1,
                    description:1,
                    image:1,
                    price:1,
                }
            }
        ]);

        res.json(products);
    } catch (error) {
        res.status(500).json({message:"Internal server error in getting recommended products"});
    }
}
export const getProductsByCategory = async(req,res)=>{
    try {
        const {cat}=req.params;
        const products=await Product.find({cat});
        res.json(products);
    } catch (error) {
        console.log('Error in getbycategory ');
        res.status(500).json({message:error.message});
    }
}

export const toggleFeaturedProduct = async(req,res)=>{
    try {
        const product = await Product.findById(req.params.id);
        if(product){
            product.isFeatured = !product.isFeatured;
            const updateProduct=await product.save();
            await updateFeaturedProductCache();
            res.json(updateProduct);
        }else{
            res.status(404).json({message:'Product not found!'});
        }
        
    } catch (error) {
        console.log('Error in toggleFeaturedProduct controller');
        res.status(500).json({message:'Server error ',error:error.message});
    }
}

async function updateFeaturedProductCache(){
    try {
        const featuredProducts = await Product.find({isFeatured:true}).lean();
        await redis.set('featured_products',JSON.stringify(featuredProducts));
    } catch (error) {
        console.log('Error in udpate cache function');
    }
}