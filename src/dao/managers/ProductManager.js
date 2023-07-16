import { productModel } from "../models/products.model.js";
import CustomErrors from "./errors/CustomErrors.js";
import EErrors from "./errors/enums.js";
import { generateProductErrorInfo } from "./errors/info.js";

export default class ProductManager {
  addProduct = async (
    title,
    description,
    code,
    price,
    status = true,
    stock,
    category,
    thumbnails,
    owner = "admin"
  ) => {
    try {
      const nuevoProducto = {
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails,
        owner
      };
      const existeProducto = await productModel.findOne({
        code: nuevoProducto.code,
      });
      if (existeProducto) {
        return "El producto ingresado ya existe";
      } else if (
        code === null ||
        code === "" ||
        title === null ||
        title === "" ||
        description === null ||
        description === "" ||
        price === null ||
        price === "" ||
        thumbnails === null ||
        thumbnails === "" ||
        stock === null ||
        stock === "" ||
        category === null ||
        category === ""
      ) {
        CustomErrors.createError({
          name: "Product creation error",
          cause: generateProductErrorInfo({
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnails,
          }),
          message: "Error trying to create a product",
          code: EErrors.PRODUCT_CREATION_ERROR,
        });
        return "Error: Faltan ingresar datos del producto";
      } else {
        await productModel.create(nuevoProducto);
        return { message: "Producto aniadido" };
      }
    } catch (error) {
      return "Error en la ejecución", error;
    }
  };

  getProducts = async (limit = 10, page = 1, query, sort) => {
    try {
      const { stock, category } = query;
      let products;
      if (stock === null && category === null) {
        products = sort
          ? await productModel.paginate(
              {},
              { limit: limit, page: page, sort: { price: sort }, lean: true }
            )
          : await productModel.paginate(
              {},
              { limit: limit, page: page, lean: true }
            );
      } else if (stock === "true") {
        // busco por stock
        products = sort
          ? await productModel.paginate(
              { stock: { $gt: 0 } },
              { limit: limit, page: page, sort: { price: sort }, lean: true }
            )
          : await productModel.paginate(
              { stock: { $gt: 0 } },
              { limit: limit, page: page, lean: true }
            );
      } else if (category) {
        //busco por categoría
        products = sort
          ? await productModel.paginate(
              { category: category },
              { limit: limit, page: page, sort: { price: sort }, lean: true }
            )
          : await productModel.paginate(
              { category: category },
              { limit: limit, page: page, lean: true }
            );
      } else {
        products = sort
          ? await productModel.paginate(
              { stock: 0 },
              { limit: limit, page: page, sort: { price: sort }, lean: true }
            )
          : await productModel.paginate(
              { stock: 0 },
              { limit: limit, page: page, lean: true }
            );
      }
      return products;
    } catch (error) {
      return "Error en la ejecución", error;
    }
  };

  getProductById = async (id) => {
    try {
      const productoEncontrado = await productModel
        .findById({ _id: id })
        .lean();
      if (!productoEncontrado) {
        return { Error: "Item Not found" };
      }
      return productoEncontrado;
    } catch (error) {
      return "Error en la ejecución", error;
    }
  };

  updateProduct = async (id, producto) => {
    try {
      const {
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails,
      } = producto;
      const productoEncontrado = await productModel
        .findById({ _id: id })
        .lean();
      const productoUpdated = {
        title: title ? title : productoEncontrado.title,
        description: description ? description : productoEncontrado.description,
        code: code ? code : productoEncontrado.code,
        price: price ? price : productoEncontrado.price,
        status: status ? status : productoEncontrado.status,
        stock: stock || stock === 0 ? stock : productoEncontrado.stock,
        category: category ? category : productoEncontrado.category,
        thumbnails: thumbnails ? thumbnails : productoEncontrado.thumbnails,
      };
      await productModel.findByIdAndUpdate({ _id: id }, { ...productoUpdated });
      return { Message: "Item updated" };
    } catch (error) {
      return "Error en la ejecución", error;
    }
  };

  deleteProduct = async (id) => {
    try {
      const existeProducto = await productModel.findById({ _id: id }).lean();
      if (!existeProducto) {
        return { message: "El producto que se quiere eliminar, no existe" };
      }
      await productModel.findByIdAndDelete({ _id: id });
      return { message: "Producto eliminado" };
    } catch (error) {
      return "Error en la ejecución", error;
    }
  };
}
