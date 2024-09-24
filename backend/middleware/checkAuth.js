import { request, response } from "express";
import jwt from 'jsonwebtoken';
import Usuario from "../models/Usuario.js";


const checkAuth = async (req = request, res = response, next) => {

    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {

        try {
            token = req.headers.authorization.split(" ")[1];

            let decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.usuario = await Usuario.findById(decoded.id).select('-password -confirmado -token -__v -updatedAt -createdAt');

            return next();
        } catch (error) {
            return res.status(404).json({ msg: "Hubo un Error" });
        }
    }

    if (!token) {
        const error = new Error("Token no Valido");
        return res.status(401).json({ msg: error.message });
    }
};

export default checkAuth;