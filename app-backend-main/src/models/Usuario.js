import mongoose, { mongo } from 'mongoose';
import findOrCreate from 'mongoose-findorcreate';
import passportLocalMongoose from 'passport-local-mongoose';

const entradaSchema = new mongoose.Schema({
  idEntrada: String,
  idPago: String,
  checkPaga: { type: Boolean, default: false },
  checkPublicadaEnReventa: {type: Boolean, default: false},
  idEvento: { type: String, ref: 'Evento' },
  nombreEvento: String,
  fechaEvento: Date,
  sector: String,
  precioPago: Number,
  devolucion: { type: Boolean, default: false },
  idNFT: { type: String, default: null },
  imagenPrincipal: String
})

const usuarioSchema = new mongoose.Schema({
  googleId: String,
  username: String,
  email: String,
  nombre: String,
  apellido: String,
  entradas: [entradaSchema],
  rol: {type: String, default: "Usuario"}
});

usuarioSchema.plugin(findOrCreate);
usuarioSchema.plugin(passportLocalMongoose);


const Usuario = mongoose.model('Usuario', usuarioSchema);
export default Usuario;
