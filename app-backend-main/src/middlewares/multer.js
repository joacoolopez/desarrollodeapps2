import multer from 'multer';
import multerS3 from 'multer-s3';
import { S3Client } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

// Configuración de AWS S3 con credenciales temporales
const s3 = new S3Client({ 
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        sessionToken: process.env.AWS_SESSION_TOKEN 
    }
});

// Configuración de multer con S3
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.S3_BUCKET_NAME,  // Nombre del bucket
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            const idEvento = uuidv4()
            req.idEvento = idEvento
            cb(null, `eventos/${idEvento}.jpg`);  // Nombre del archivo en S3
        }
    })
});

// Exporta el middleware de multer configurado
export default upload;
