const eliminarUsuario = (_id)=>{
    console.log("Este es el id del usuario", _id);
    fetch(`http://localhost:8080/api/users/${_id}`, {
        method: 'DELETE'
     })
    document.location.reload()
}

const cambiarRol = (_id)=>{
    console.log("Este es el id del usuario", _id);
    fetch(`http://localhost:8080/api/users/premium/${_id}`, {
        method: 'GET'
     })
     document.location.reload()
}

