const eliminarUsuario = (_id)=>{
    console.log("Este es el id del usuario", _id);
    fetch(`https://coderbackend-production-ce8b.up.railway.app/api/users/${_id}`, {
        method: 'DELETE'
     })
    document.location.reload()
}

const cambiarRol = (_id)=>{
    console.log("Este es el id del usuario", _id);
    fetch(`https://coderbackend-production-ce8b.up.railway.app/api/users/premium/${_id}`, {
        method: 'GET'
     })
     document.location.reload()
}

