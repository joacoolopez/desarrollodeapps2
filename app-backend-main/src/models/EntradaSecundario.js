import mongoose, { mongo } from 'mongoose';

const entradaSecundarioSchema = new mongoose.Schema({
    idPublicacion: String,
    idEntrada: String,
    idEvento: String,
    nombreEvento: String,
    sector: String,
    precioReventa: Number,
    fechaEvento: Date,
    idUsuario: String,
    nombreUsuario: String,
    idNFT: String,
    imagenPrincipal: String
  })

const EntradaSecundario = mongoose.model('EntradaSecundario', entradaSecundarioSchema);
export default EntradaSecundario;
