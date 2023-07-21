import e from "express";
import { productService, socketServer } from "../app.js";
import { userModel } from "../dao/models/users.model.js";
import { transporter } from "../utils.js";

export const getProducts = async (req, res) => {
  try {
    let { limit, page, query, sort } = req.query;
    const queryABuscar = {
      stock: query === "true" || (query === "false" && query) ? query : null,
      category: query !== "true" && query !== "false" && query ? query : null,
    };
    req.logger.debug(`La queryABuscar es:  ${queryABuscar}`);
    const products = await productService.getProducts(
      limit,
      page,
      queryABuscar,
      sort
    );

    const { hasNextPage, hasPrevPage, nextPage } = products;
    const nextLink = hasNextPage
      ? `http://localhost:8080/api/products/?page=${nextPage}`
      : null;
    const prevLink = hasPrevPage
      ? `http://localhost:8080/api/products/?page=${products.page - 1}`
      : null;

    res.send({ status: "success", payload: products, prevLink, nextLink });
  } catch (error) {
    req.logger.error(error);
  }
};

export const getProductById = async (req, res) => {
  try {
    const { pid } = req.params;
    req.logger.debug(req.params);
    const product = await productService.getProductById(pid);
    req.logger.debug(product);
    res.send(product);
  } catch (error) {
    req.logger.error(error);
  }
};

export const addProduct = async (req, res) => {
  try {
    //console.log("El req user en add es: ", req.user);
    const owner = req.user.user.rol !== 'premium' ? 'admin'  : req.user.user.email;
    console.log("El owner en add es: ", owner);
    const {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails
    } = req.body;
    const respuesta = await productService.addProduct(
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
      owner
    );
    socketServer.emit("addProduct", () => {
      req.logger.info("nuevo producto aniadido");
    });
    res.send(respuesta);
  } catch (error) {
    req.logger.error(error);
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { pid } = req.params;
    const {
      title,
      description,
      code,
      price,
      status = true,
      stock,
      category,
      thumbnails,
    } = req.body;
    const respuesta = await productService.updateProduct(pid, {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    });
    socketServer.emit("updatedProduct", () => {
      req.logger.info("Product updated");
    });
    res.send(respuesta);
  } catch (error) {
    req.logger.error(error);
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { pid } = req.params;
    const {user} = req.user;
    let respuesta = "";
    const producto = await productService.getProductById(pid);
    const isPremium = await userModel.findOne({email: producto.owner});
    if(user.rol !== 'premium'){
      respuesta = await productService.deleteProduct(pid);
    }else if(producto.owner === user.email){
      await productService.deleteProduct(pid);
      respuesta = "Producto eliminado";
      res.send({message: respuesta});
    }else{
      respuesta = "Este producto no te pertenece";
      res.send({message: respuesta});
    }
    console.log("El isPremium es: ", isPremium);
    if(isPremium.rol === 'premium'){
      process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
      await transporter.sendMail({
        from:'TiendaRopa <lea.apagro@gmail.com>',
        to: isPremium.email,
        subject:'Producto eliminado',
        html:`
        <div>
            <h1>Producto eliminado</h1>
            <p>Su producto ${pid} ha sido eliminado por ${user.email}</p>
        </div>`,
        attachments:[]
      }); 
      process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "1";
    }
    socketServer.emit("deleteProduct", () => {
      req.logger.info(respuesta);
    });
    res.send({message: respuesta});
  } catch (error) {
    req.logger.error(error);
  }
};
