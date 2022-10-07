const socket = io();

const btnEnviar = document.getElementById('btnEnviar');
const inputNombre = document.getElementById('inputNombre');
const inputMensaje = document.getElementById('inputMensaje');
const mensajes = document.getElementById('mensajes');
const numUsuarios = document.getElementById('numUsuarios');

btnEnviar.addEventListener('click', () => {
    const body = {
        nombre: inputNombre.value,
        mensaje: inputMensaje.value,
        socketId :socket.id
    }

    /// pasamos el evento / mensaje al servidor
    socket.emit('mensaje_chat',body);
});


// me suscribo a la recepcion del evento mensaje_chat. esta pendiente para cuendo el servidor envie un mensaje
socket.on('mensaje_chat', (body) => {

    /// creamos un nuevo elemento mensaje al DOM
    const li = document.createElement('li');
    li.innerHTML = `<strong>${body.nombre}:</strong> ${body.mensaje}`;

    /// comprobamos si es el usuario el que envia el mensaje
    if (body.socketId === socket.id) {
        li.classList.add('propietario'); /// añadimos una clase para diferenciar quien envia darle css
    }

    mensajes.appendChild(li);
     /// me mantiene al final del scroll en la pantalla
     const main = document.querySelector('.main')
    main.scrollTo(0, main.scrollHeight);
});

// me suscribo a la recepcion del evento usuarios_chat. esta pendiente para cuendo el servidor envie el nuemro de usuarios
socket.on('usuarios_chat', (clientsCount) => {

    /// creamos un nuevo elemento mensaje al DOM
    numUsuarios.innerText = clientsCount;
    
});