import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const usuarioSchema = mongoose.Schema({
    nombre: {
        trim: true,
        require: true,
        type: String
    },
    password: {
        trim: true,
        require: true,
        type: String
    },
    email: {
        trim: true,
        require: true,
        type: String,
        unique: true
    },
    token: {
        type: String,
    },
    confirmado: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true,
});

usuarioSchema.pre("save", async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

usuarioSchema.methods.comprobarPassword = async function (passFormulario) {
    return await bcrypt.compare(passFormulario, this.password);
};

const Usuario = mongoose.model('Usuario', usuarioSchema);

export default Usuario;