const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const { createServer } = require('http');
const { dbConnection } = require('../database/config');
const { socketController } = require('../sockets/socketController');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.server = createServer( this.app );
        this.io = require('socket.io')( this.server );

        this.paths = {
            auth: '/api/auth',
            archivos: '/api/uploads',
            buscar: '/api/buscar',
            categorias: '/api/categorias',
            productos: '/api/productos',
            usuarios: '/api/usuarios',
        }

        /* Conexión a la base de datos */
        this.connectionDB();
        /* Middlewares */
        this.middlewares();
        /* Rutas de mi aplicación */
        this.routes();
        /* Escuchando eventos de sockets */
        this.socketsEvents();
    }

    async connectionDB() {
        await dbConnection();
    }

    middlewares() {
        /* CORS */
        this.app.use( cors() );
        /* Lectura y Parseo del Body */
        this.app.use( express.json() );
        /* Directorio Público */
        this.app.use( express.static('public') );
        /* Cargar de Archivos  */
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));
    }

    routes() {
        this.app.use( this.paths.auth, require('../routes/auth') );
        this.app.use( this.paths.archivos, require('../routes/uploads') );
        this.app.use( this.paths.buscar, require('../routes/search') );
        this.app.use( this.paths.categorias, require('../routes/categorias') );
        this.app.use( this.paths.productos, require('../routes/productos') );
        this.app.use( this.paths.usuarios, require('../routes/user') );
    }

    socketsEvents() {
        this.io.on( 'connection', socketController );
    }

    listen() {
        this.server.listen(this.port, () => {
            console.log(`REST Server corriendo en el puerto: ${ this.port }`);
        });
    }
}

module.exports = Server;