const {io} = require('../index');
const { comprobarJWT } = require('../helpers/jwt');
const { usuarioConectado, usuarioDesconectado, grabarMensaje} = require('../controllers/socket');
// Mensajes de sockets
io.on('connection',  (client) => {
    console.log('Cliente conectado');

    const [valido, uid] = comprobarJWT(client.handshake.headers['x-token']);
    
    // Verificar autenticación
    if(!valido) {return client.disconnect();}

    // Cliente autenticado
    usuarioConectado(uid);

    // Ingresar al usuario en una sala
    // Sala con el identificador de la BBDD
    client.join(uid);

    // Escuchar del cliente el mensaje-personal
    client.on('mensaje-personal', async (datos) => {
        // TODO Grabar mensaje
        await grabarMensaje(datos);
        io.to(datos.para).emit('mensaje-personal', datos);
    });


    console.log('Cliente Autenticado');

    client.on('disconnect', () => {
        console.log('Cliente desconectado');
        usuarioDesconectado(uid);
    });

    // client.on('mensaje', (payload)=> {
    //     console.log('Mensaje!!!', payload);

    //     io.emit('mensaje',{admin: 'Nuevo mensaje'});
    // });
});