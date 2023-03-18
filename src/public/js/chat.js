const socket = io();
socket.on('messageLogs', (data)=>{
    let log = document.getElementById('messageLogs');
    let messageBox = document.getElementById('messageBox')
    
    let messages = "";
    data.forEach(message => {
        messages = messages +`${message.user} dice: ${message.message}</br>`
    });
    log.innerHTML = messages
    messageBox.innerHTML = `${log.outerHTML}`;
    
})
let user;
let chatBox = document.getElementById('chatBox');

Swal.fire({
    title:"Identifícate",
    input:"text",
    text:"Ingresa el usuario para identificarte en el chat",
    inputValidator: (value)=>{
        return !value && '¡Necesitas escribir un nombre de usuario para continuar!'
    },
    allowOutsideClick: false
}).then(result=>{
    user=result.value
});

chatBox.addEventListener('keyup', evt=>{
    if(evt.key==="Enter"){
        if (chatBox.value.trim().length>0) {
            socket.emit("message",{user:user, message:chatBox.value});
            chatBox.value="";
        }
    }
});
