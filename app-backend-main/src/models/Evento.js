import mongoose from 'mongoose';

const EventoSchema = new mongoose.Schema({
    id: { type: String, required: true },
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    ubicacion: { type: String, required: true },
    fecha: { type: Date, required: true },
    habilitado: { type: Boolean, required: true },
    estadio: { type: Number, required: true },
    cantidadSectorGeneral: { type: Number, required: true },
    precioGeneralBEAT: { type: Number, required: true },
    cantidadSectorVip: { type: Number, required: true },
    precioVipBEAT: { type: Number, required: true },
    cantidadSectorIzquierda: { type: Number, default: null },
    precioIzquierdaBEAT: { type: Number, default: null },
    cantidadSectorDerecha: { type: Number, default: null },
    precioDerechaBEAT: { type: Number, default: null },
    imagenPrincipal: {type: String, default: null}
});



const Evento = mongoose.model('Evento', EventoSchema);
export default Evento;
