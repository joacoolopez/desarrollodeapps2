import mongoose from 'mongoose'
import dotenv from 'dotenv';
dotenv.config();

const dbConnection = async () =>{
    try{
        await mongoose.connect(process.env.CONNECTION_STRING)
        console.log('Database running');
    }
    catch(err){
        console.error(err);
        throw new Error('Error en la conexión de la BD');
    }
}

export {dbConnection};