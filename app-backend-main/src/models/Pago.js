import mongoose from 'mongoose';

const PagoSchema = new mongoose.Schema({
    idPago: { type: String, required: true },
    estado: {type: Boolean, default: false},
    idUsuario: { type: String, required: true },
    idEvento: {type: String, required: true},
    listaEntradas: {type: [String], required: true},
    precioTotal: {type: Number, required: true},
    estadio: { type: Number, required: true },
    cantidadSectorGeneral: { type: Number, required: true },
    cantidadSectorVip: { type: Number, required: true },
    cantidadSectorIzquierda: { type: Number, default: 0 },
    cantidadSectorDerecha: { type: Number, default: 0 },
});



const Pago = mongoose.model('Pago', PagoSchema);
export default Pago;
