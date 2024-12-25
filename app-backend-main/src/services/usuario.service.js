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


const getImagen = async (res, idUsuario) => {
    const bucketName = process.env.S3_BUCKET_NAME; // Nombre de tu bucket

    try {
        const command = new GetObjectCommand({
            Bucket: bucketName,
            Key: `usuarios/${idUsuario}.jpg`
        });

        const response = await s3.send(command);
        
        // Pipe the response stream to the client
        const passthroughStream = new stream.PassThrough();
        response.Body.pipe(passthroughStream);

        // Establecer encabezados para la respuesta
        res.setHeader('Content-Type', 'image/jpeg');  // Asegúrate de que sea el tipo correcto
        res.setHeader('Content-Disposition', `inline; filename="${idUsuario}.jpg"`);


        // Pipe the passthrough stream to the response
        passthroughStream.pipe(res);
    } catch (err) {
        console.error('Error al obtener la imagen:', err);
        res.status(500).send('Error al obtener la imagen');
    }
};

export default {getImagen}