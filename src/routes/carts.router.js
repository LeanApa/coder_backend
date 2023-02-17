import { Router } from "express";
import { cartManager } from "../app.js";

const router = Router();

router.get('/:cid', async (req, res)=>{
    const {cid} = req.params;
    console.log(req.params);
    const product = await cartManager.getProducts(+pid);
    console.log(product);
    res.send(product);
})

router.post('/', async (req,res)=>{
    const {products} = req.body;
    const respuesta = await cartManager.addCart(products);
    res.send(respuesta);
});

export default router;