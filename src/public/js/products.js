const agregarAlCarrito = (_id,cart)=>{
    console.log("Este es el id del producto", _id);
    console.log("Tipo de dato del carrito", cart);

    fetch(`https://coderbackend-production-ce8b.up.railway.app/api/carts/${cart}/products/${_id}`, {
        method: 'POST'
     })
}
