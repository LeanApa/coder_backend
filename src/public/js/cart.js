const eliminarProducto = (_id,cart)=>{
    console.log("Este es el id del producto", _id);
    console.log("Tipo de dato del carrito", cart);

    fetch(`http://localhost:8080/api/carts/${cart}/products/${_id}`, {
        method: 'DELETE'
     })
     window.location.href = window.location.href;
}