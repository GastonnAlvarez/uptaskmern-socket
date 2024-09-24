import { request, response } from "express";
import Usuario from "../models/Usuario.js";
import generarId from "../helpers/generarId.js";
import generarJWT from "../helpers/generarJWT.js";
import { emailRegistro, emailOlvidePassword } from "../helpers/email.js";

const registrar = async (req = request, res = response) => {
    // Evitamos registro duplicados
    const { email } = req.body;
    const existeUsuario = await Usuario.findOne({ email });
    if (existeUsuario) {
        const error = new Error("El email se encuentra en uso");
        return res.status(401).json({ msg: error.message });
    };

    try {
        const usuario = new Usuario(req.body);
        usuario.token = generarId();
        await usuario.save();

        emailRegistro({
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token
        })

        return res.json({ msg: "Usuario creado correctamente, revisa tu email y sigue los pasos" });

    } catch (error) {
        console.log(error);
    };
};

const autenticar = async (req = request, res = response) => {
    const { email, password } = req.body;
    // Comprobar si el usuario existe

    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
        const error = new Error("Email Incorrecto");
        return res.status(404).json({ msg: error.message });
    };

    // Comprobamos si el usuario esta confirmado
    if (!usuario.confirmado) {
        const error = new Error("Tu cuenta no esta confirmada");
        return res.status(404).json({ msg: error.message });
    };

    // Comprobamos si el password es correcto
    if (await usuario.comprobarPassword(password)) {
        return res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario._id)
        })
    } else {
        const error = new Error("El Password es Incorrecto");
        return res.status(404).json({ msg: error.message });
    };
};

const confirmar = async (req = request, res = response) => {
    const { token } = req.params;

    // Obteniendo usuario de mi DB
    const tokenValido = await Usuario.findOne({ token });

    // Error por si NO obtengo un usuario valido
    if (!tokenValido) {
        const error = new Error("Token NO valido");
        return res.status(404).json({ msg: error.message });
    }

    try {
        // Confirmado de 'false' a 'true' y reseteo de 'token'
        tokenValido.confirmado = true;
        tokenValido.token = "";
        await tokenValido.save();
        return res.json({ msg: "Usuario confirmado Correctamente" });
    } catch (error) {
        console.log(error);
    }

};

const olvidePassword = async (req = request, res = response) => {
    const { email } = req.body

    // Comprobar si el usuario existe
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
        const error = new Error("Email Incorrecto");
        return res.status(404).json({ msg: error.message });
    };

    try {
        usuario.token = generarId();
        await usuario.save();

        // Enviando Instrucciones al Email
        emailOlvidePassword({
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token
        })

        return res.json({ msg: "Hemos enviado un email con las instrucciones" });
    } catch (error) {

    }
};

const comprobarToken = async (req = request, res = response) => {
    const { token } = req.params;

    const usuarioToken = await Usuario.findOne({ token });

    // Verifico si el token es o no valido y solo devuelvo error
    if (usuarioToken) {
        return res.json({ msg: "Token valido y el usuario Existe" })
    } else {
        const error = new Error("Token NO valido");
        return res.status(404).json({ msg: error.message });
    }
};

const nuevoPassword = async (req = request, res = response) => {
    const { token } = req.params;
    const { password } = req.body;

    const usuarioToken = await Usuario.findOne({ token });

    // Verificando si el token es valido.

    if (usuarioToken) {
        usuarioToken.password = password;
        usuarioToken.token = '';

        try {
            await usuarioToken.save();
            return res.json({ msg: "Password modificado correctamente" });
        } catch (error) {
            console.log(error);
        }

    } else {
        const error = new Error("Token NO valido");
        return res.status(404).json({ msg: error.message });
    }


};

const perfil = async (req = request, res = response) => {
    const { usuario } = req

    res.json(usuario)
};

export {
    registrar,
    autenticar,
    confirmar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    perfil
}