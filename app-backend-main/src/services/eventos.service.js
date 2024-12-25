import Evento from "../models/Evento.js"
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
import stream from 'stream';

dotenv.config();
const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        sessionToken: process.env.AWS_SESSION_TOKEN
    }
});

const getEventos = async () => {
    const hoy = new Date()
    const eventos = await Evento.find({ 
        fecha: { $gt: new Date(hoy) }, 
        habilitado: true 
      });
    return eventos
}

const postEvento = async (id, nombre, descripcion, ubicacion, fecha, habilitado, estadio, cantidadSectorGeneral, precioGeneralBEAT, cantidadSectorVip, precioVipBEAT, cantidadSectorIzquierda, precioIzquierdaBEAT, cantidadSectorDerecha, precioDerechaBEAT, imagenPrincipal)  => {
    if (estadio == 1) {
        const eventoData = {id, nombre, descripcion, ubicacion, fecha, habilitado, estadio, cantidadSectorGeneral, precioGeneralBEAT, cantidadSectorVip, precioVipBEAT, cantidadSectorIzquierda, precioIzquierdaBEAT, cantidadSectorDerecha, precioDerechaBEAT, imagenPrincipal}
        const eventoCreado = await Evento.create(eventoData)
        console.log(eventoCreado)
        return eventoCreado
    } else if (estadio == 2) {
        const eventoData = {id, nombre, descripcion, ubicacion, fecha, habilitado, estadio, cantidadSectorGeneral, precioGeneralBEAT, cantidadSectorVip, precioVipBEAT, imagenPrincipal}
        const eventoCreado = await Evento.create(eventoData)
        return eventoCreado
    }
    
}
const editEvento = async (
    id,
    nombre,
    descripcion,
    ubicacion,
    fecha,
    habilitado,
    estadio,
    precioGeneralBEAT,
    precioVipBEAT,
    precioIzquierdaBEAT,
    precioDerechaBEAT,
    imagenPrincipal
) => {
    const eventoData = {
        nombre,
        descripcion,
        ubicacion,
        fecha,
        habilitado,
        estadio,
        precioGeneralBEAT,
        precioVipBEAT,
        imagenPrincipal
    };

    if (estadio === 1) {
        eventoData.precioIzquierdaBEAT = precioIzquierdaBEAT;
        eventoData.precioDerechaBEAT = precioDerechaBEAT;
    }

    const eventoActualizado = await Evento.findOneAndUpdate({ id: id }, eventoData, { new: true });
    return eventoActualizado;
};

const getEvento = async (idEvento) => {
    const evento = await Evento.find({id:idEvento});
    return evento
}

const getImagen = async (res, idEvento) => {
    const bucketName = process.env.S3_BUCKET_NAME; // Nombre de tu bucket

    try {
        const command = new GetObjectCommand({
            Bucket: bucketName,
            Key: `eventos/${idEvento}.jpg`
        });

        const response = await s3.send(command);
        
        // Pipe the response stream to the client
        const passthroughStream = new stream.PassThrough();
        response.Body.pipe(passthroughStream);

        // Establecer encabezados para la respuesta
        res.setHeader('Content-Type', 'image/jpeg');  // Asegúrate de que sea el tipo correcto
        res.setHeader('Content-Disposition', `inline; filename="${idEvento}.jpg"`);


        // Pipe the passthrough stream to the response
        passthroughStream.pipe(res);
    } catch (err) {
        console.error('Error al obtener la imagen:', err);
        res.status(500).send('Error al obtener la imagen');
    }
};

const deleteEvento = async (id) => {
    const eventoEliminado = await Evento.findOneAndDelete({ id });
        if (!eventoEliminado) {
            console.log(`No se encontró un evento con el id: ${id}`);
        }
        return eventoEliminado;
    
}

export default {getEventos, postEvento, editEvento, getEvento, getImagen, deleteEvento}