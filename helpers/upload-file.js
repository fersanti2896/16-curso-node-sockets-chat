const path = require('path');
const { v4: uuidv4 } = require('uuid');

/**
 * Función que guarda el archivo en el directorio del servidor.
 * @param {String} files Archivo que se recibe desde la request.
 * @param {Array} extensionValidas Extensiones validas del archivo. 
 * @param {String} folder Carpeta donde se almacenará el archivo. 
 * @returns Nombre del archivo en formato UUID
 */
const uploadFile = ( files, extensionValidas = ['png', 'PNG', 'jpg', 'JPG', 'GIF', 'gif', 'jpeg'], folder = '' ) => {
    return new Promise( (resolve, reject ) => {
        const { archivo } = files;
        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[ nombreCortado.length - 1 ];

        if( !extensionValidas.includes( extension ) ) {
            return reject(`La extensión ${ extension } no es permitida. Extensiones permitidas: ${ extensionValidas }`)
        }
        
        const nombreTemp = uuidv4() + '.' + extension;
        const uploadPath = path.join( __dirname, '../uploads/', folder, nombreTemp );

        archivo.mv(uploadPath, (err) => {
            if (err) {
                reject( err );
            }

            resolve( nombreTemp );
        });
    });    
}

module.exports = {
    uploadFile
}