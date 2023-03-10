import mongoose from "mongoose";

const productCollection = 'products';

const productSchema = new mongoose.Schema({
    title: String, 
    description: String, 
    code: {
        type: String,
        unique:true
    }, 
    price: Number, 
    status: true, 
    stock: Number, 
    category: String, 
    thumbnails: String 
})

export const productModel = mongoose.model(productCollection,productSchema);

