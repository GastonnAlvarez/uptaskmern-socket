import mongoose from "mongoose";

const tareaSchema = mongoose.Schema({
    nombre: {
        trim: true,
        require: true,
        type: String
    },
    descripcion: {
        trim: true,
        require: true,
        type: String
    },
    estado: {
        type: Boolean,
        default: false
    },
    fechaEntrega: {
        type: Date,
        required: true,
        default: Date.now()
    },
    prioridad: {
        type: String,
        required: true,
        enum: ['Baja', 'Media', 'Alta']
    },
    proyecto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Proyecto"
    },
    completado: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario"
    }
}, {
    timestamps: true
});

const Tarea = mongoose.model("Tarea", tareaSchema);

export default Tarea;