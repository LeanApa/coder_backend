import { cartService, messagesService, productService } from "../app.js";
import { userModel } from "../dao/models/users.model.js";
import jwt from "jsonwebtoken";
import { isValidPassword, createHash } from "../utils.js";
import { ticketModel } from "../dao/models/tickets.model.js";

export const login = async (req, res) => {
  return res.redirect("/login");
};

export const realtimeproducts = async (req, res) => {
  let { limit, page, query, sort } = req.query;
  const queryABuscar = {
    stock: query === "true" || (query === "false" && query) ? query : null,
    category: query !== "true" && query !== "false" && query ? query : null,
  };

  const products = await productService.getProducts(
    limit,
    page,
    queryABuscar,
    sort
  );
  const { hasNextPage, hasPrevPage, nextPage } = products;
  const nextLink = hasNextPage
    ? `https://coderbackend-production-ce8b.up.railway.app/products/?page=${nextPage}`
    : null;
  const prevLink = hasPrevPage
    ? `https://coderbackend-production-ce8b.up.railway.app/products/?page=${products.page - 1}`
    : null;
  res.render("realTimeProducts", { products, nextLink, prevLink });
};

export const getAllMessages = async (req, res) => {
  const messages = await messagesService.getAllMessages();
  res.render("chat", { messages });
};

export const getProducts = async (req, res) => {
  try {
    req.logger.debug(`req.user es:  ${req.user}`);
    const user = {
      first_name: req.user.user
        ? req.user.user.firt_name
        : req.session.user.firt_name,
      last_name: req.user.user
        ? req.user.user.last_name
        : req.session.user.last_name,
      email: req.user.user ? req.user.user.email : req.session.user.email,
      age: req.user.user ? req.user.user.age : req.session.user.age,
      rol: req.user.user ? req.user.user.rol : req.session.user.rol,
      cart: req.user.user ? req.user.user.cart : req.session.user,
    };
    let { limit, page, query, sort } = req.query;
    const queryABuscar = {
      stock: query === "true" || (query === "false" && query) ? query : null,
      category: query !== "true" && query !== "false" && query ? query : null,
    };

    const products = await productService.getProducts(
      limit,
      page,
      queryABuscar,
      sort
    );
    const { hasNextPage, hasPrevPage, nextPage } = products;
    const nextLink = hasNextPage
      ? `https://coderbackend-production-ce8b.up.railway.app/products/?page=${nextPage}`
      : null;
    const prevLink = hasPrevPage
      ? `https://coderbackend-production-ce8b.up.railway.app/products/?page=${products.page - 1}`
      : null;

    res.render("products", { products, nextLink, prevLink, user });
  } catch (error) {
    req.logger.error(`error en getProducts ${error}`);
  }
};

export const getProductsByCartId = async (req, res) => {
  const { cid } = req.params;
  const {user} = req.user;
  console.log("ACA ESTA EL USUARIO", user);
  const products = await cartService.getProductsByCartId(cid);
  res.render("cart", { products, user });
};

export const loginRender = async (req, res) => {
  res.render("login");
};

export const register = async (req, res) => {
  res.render("register");
};

export const verify = async (req, res) => {
  try {
    const { token, tomail } = req.query;
    jwt.verify(token, "secreto");
    res.render("passwordReset", { tomail });
  } catch (error) {
    res.render("login");
  }
};

export const passwordReset = async (req, res) => {
  try {
    const { newPassword, tomail } = req.body;
    const user = await userModel.findOne({ email: tomail });
    if (isValidPassword(user, newPassword)) {
      const message = "La nueva contraseña no puede ser igual a la anterior";
      res.render("passwordReset", { tomail, message });
    }else{
      user.password = createHash(newPassword);
      await userModel.findByIdAndUpdate(user._id, user);
      res.redirect("/login");
    }
  
  } catch (error) {
    console.log(error);
  }
};
export const usersAdmin = async (req, res) => {
  const usersList = await userModel.find();
  const usersFiltered = usersList.filter((user) => user.rol !== "admin");
  const userAdmin = req.user.user;
  console.log("USUARIO ADMINISTRADOR",userAdmin);
  const users = usersFiltered.map((user) => {
    return {
      _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      age: user.age,
      rol: user.rol,
      last_connection: user.last_connection
    };
  });
  res.render("userAdmin", { users, userAdmin });
}

export const ticket = async (req, res) => {
  const { tid } = req.params;
  const ticket = await ticketModel.findById(tid).lean();
  res.render("ticket", { ticket });
}