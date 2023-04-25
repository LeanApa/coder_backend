// import { Router } from "express";
import { cartManager } from "../app.js";
import CustomRouter from "./router.router.js";


export default class CartsRouter extends CustomRouter{
    init(){
        this.get('/',["PUBLIC"], async (req,res)=>{
            const carts = await cartManager.getCarts();
            res.send(carts); 
        });
        
        this.get('/:cid',["PUBLIC"], async (req, res)=>{
            const {cid} = req.params;
            console.log(req.params);
            const products = await cartManager.getProductsByCartId(cid);
            console.log(products);
            res.send(products);
        })
        
        this.post('/',["PUBLIC"], async (req,res)=>{
            const respuesta = await cartManager.addCart();
            res.send(respuesta);
        });
        
        this.post('/:cid/products/:pid',["PUBLIC"], async (req,res)=>{
            const {cid, pid} = req.params;
            const respuesta = await cartManager.addProduct(cid, pid);
            res.send(respuesta);
        });
        
        this.delete('/:cid/products/:pid',["PUBLIC"], async (req,res)=>{
            const {cid,pid} = req.params;
            const respuesta = await cartManager.deleteProductByProductId(cid, pid);
            res.send(respuesta); 
        });
        
        this.put('/:cid',["PUBLIC"], async(req,res)=>{
            const {cid} = req.params;
            const newProducts = req.body;
            console.log("Productos nuevos: ", newProducts);
            const respuesta = await cartManager.updateProductsByCartId(cid,newProducts);
            res.send(respuesta);
        
        })
        
        this.put('/:cid/products/:pid',["PUBLIC"], async(req, res)=>{
            const {cid, pid} = req.params;
            const {quantity} = req.body;
            const respuesta = await cartManager.updateProductQuantityByProductId(cid,pid,+quantity);
            res.send(respuesta);
        });
        
        this.delete('/:cid',["PUBLIC"], async(req,res)=>{
            const {cid} = req.params;
            const respuesta = await cartManager.deleteProductsByCartId(cid);
            res.send(respuesta);
        });
    }
}
/* const router = Router();

router.get('/', async (req,res)=>{
    const carts = await cartManager.getCarts();
    res.send(carts); 
})

router.get('/:cid', async (req, res)=>{
    const {cid} = req.params;
    console.log(req.params);
    const products = await cartManager.getProductsByCartId(cid);
    console.log(products);
    res.send(products);
})

router.post('/', async (req,res)=>{
    const respuesta = await cartManager.addCart();
    res.send(respuesta);
});

router.post('/:cid/products/:pid', async (req,res)=>{
    const {cid, pid} = req.params;
    const respuesta = await cartManager.addProduct(cid, pid);
    res.send(respuesta);
});

router.delete('/:cid/products/:pid', async (req,res)=>{
    const {cid,pid} = req.params;
    const respuesta = await cartManager.deleteProductByProductId(cid, pid);
    res.send(respuesta); 
});

router.put('/:cid', async(req,res)=>{
    const {cid} = req.params;
    const newProducts = req.body;
    console.log("Productos nuevos: ", newProducts);
    const respuesta = await cartManager.updateProductsByCartId(cid,newProducts);
    res.send(respuesta);

})

router.put('/:cid/products/:pid', async(req, res)=>{
    const {cid, pid} = req.params;
    const {quantity} = req.body;
    const respuesta = await cartManager.updateProductQuantityByProductId(cid,pid,+quantity);
    res.send(respuesta);
})

router.delete('/:cid', async(req,res)=>{
    const {cid} = req.params;
    const respuesta = await cartManager.deleteProductsByCartId(cid);
    res.send(respuesta);
})

export default router; */