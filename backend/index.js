import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

import conectarDB from './config/db.js';
import usuarioRoutes from './routes/usuarioRoutes.js';
import proyectoRoutes from './routes/proyectoRoutes.js';
import tareaRoutes from './routes/tareaRoutes.js';

const app = express();
app.use(express.json());

// Leyendo variables de entorno
dotenv.config();
// Conectando a la DB
conectarDB();
// Habilitando el CORS
const whiteList = [process.env.FRONTEND_URL]
const corsOptions = {
    origin: function (origin, callback) {
        if (whiteList.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error("Error de CORS"))
        }
    }
}
app.use(cors(corsOptions))

// Routing
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/proyectos', proyectoRoutes);
app.use('/api/tareas', tareaRoutes);

const PORT = process.env.PORT || 4000;

const servidor = app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

// Socket.io
import { Server } from 'socket.io'
const io = new Server(servidor, {
    pingTimeout: 60000,
    cors: {
        origin: process.env.FRONTEND_URL,
    }
})

io.on("connection", (socket) => {
    // Definiendo los eventos de Socket.io
    socket.on("abrir proyecto", (proyecto) => {
        socket.join(proyecto)
    })
    socket.on('nueva tarea', (tarea) => {
        const proyecto = tarea.proyecto
        socket.to(proyecto).emit('tarea agregada', tarea)
    })
    socket.on("eliminar tarea", (tarea) => {
        const proyecto = tarea.proyecto
        socket.to(proyecto).emit('tarea eliminada', tarea)
    })
    socket.on("actualizar tarea", tarea => {
        const proyecto = tarea.proyecto._id
        socket.to(proyecto).emit('tarea editada', tarea)
    })
    socket.on('completar tarea', tarea => {
        const proyecto = tarea.proyecto._id
        socket.to(proyecto).emit('tarea completada', tarea)
    })
})