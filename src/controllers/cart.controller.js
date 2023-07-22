import { cartService, productService, ticketService } from "../app.js";

export const getCarts = async (req, res) => {
  try {
    const carts = await cartService.getCarts();
    res.send(carts);
    res.send({ status: "success", payload: carts})
  } catch (error) {
    req.logger.error(error);
  }
};

export const getProductsByCartId = async (req, res) => {
  try {
    const { cid } = req.params;
    const products = await cartService.getProductsByCartId(cid);
    req.logger.debug(products);
    res.send(products);
  } catch (error) {
    req.logger.error(error);
  }
};

export const addCart = async (req, res) => {
  try {
    const respuesta = await cartService.addCart();
    res.send(respuesta);
  } catch (error) {
    req.logger.error(error);
  }
};

export const addProduct = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { user } = req.user;
    const producto = await productService.getProductById(pid);
    let respuesta = "";
    if (user.rol === "premium" && producto.owner === user.email) {
      respuesta = "No puede agregar al carrito un producto que es suyo"
      res.status(400).send({message: respuesta});
    }
    respuesta = await cartService.addProduct(cid, pid);
    res.send(respuesta);
  } catch (error) {
    req.logger.error(error);
  }
};

export const deleteProductByProductId = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const respuesta = await cartService.deleteProductByProductId(cid, pid);
    res.send(respuesta);
  } catch (error) {
    req.logger.error(error);
  }
};

export const updateProductsByCartId = async (req, res) => {
  try {
    const { cid } = req.params;
    const newProducts = req.body;
    req.logger.debug("Productos nuevos: ", newProducts);
    const respuesta = await cartService.updateProductsByCartId(
      cid,
      newProducts
    );
    res.send(respuesta);
  } catch (error) {
    req.logger.error(error);
  }
};

export const updateProductQuantityByProductId = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const respuesta = await cartService.updateProductQuantityByProductId(
      cid,
      pid,
      +quantity
    );
    res.send(respuesta);
  } catch (error) {
    req.logger.error(error);
  }
};

export const deleteProductsByCartId = async (req, res) => {
  try {
    const { cid } = req.params;
    const respuesta = await cartService.deleteProductsByCartId(cid);
    res.send(respuesta);
  } catch (error) {
    req.logger.error(error);
  }
};

export const purchaseProducts = async (req, res) => {
  try {
    const { cid } = req.params;
    const { email } = req.user.user;
    const userAgent = req.headers['user-agent'];
    req.logger.debug("El email es: ", email);
    const { productosNoComprados, amount } = await cartService.purchaseProducts(
      cid
    );
    const ticket = await ticketService.createTicket(amount, email);
    if (userAgent.includes('Postman') || userAgent.includes('HTTPClient')){
      res.send({ ProductosNoComprados: productosNoComprados, tiket: ticket });
    }else{
      res.redirect(`/tickets/${ticket._id}`);
    }
    
  } catch (error) {
    req.logger.error(error);
  }
};
