import mongoose from 'mongoose';

const PagoReventaSchema = new mongoose.Schema({
    idPago: { type: String, required: true },
    idPublicacion: { type: String, required: true },
    estado: {type: Boolean, default: false},
    idUsuario: { type: String, required: true},
    idEvento: {type: String, required: true},
    precioTotal: {type: Number, required: true}
});



const PagoReventa = mongoose.model('PagoReventa', PagoReventaSchema);
export default PagoReventa;
