import Proyecto from "../models/Proyecto.js";
import Tarea from "../models/Tarea.js";
import Usuario from "../models/Usuario.js";

const obtenerProyectos = async (req = request, res = response) => {
    const proyectos = await Proyecto
        .find({
            '$or': [
                { 'colaboradores': { $in: req.usuario } },
                { 'creador': { $in: req.usuario } },
            ]
        })
        .select('-tareas');

    return res.json(proyectos);
};
const nuevoProyecto = async (req = request, res = response) => {

    const proyecto = new Proyecto(req.body);
    proyecto.creador = req.usuario._id;

    try {
        const proyectoAlmacenado = await proyecto.save();
        return res.json(proyectoAlmacenado);
    } catch (error) {
        console.log(error);
    }

};
const obtenerProyecto = async (req = request, res = response) => {
    const { id } = req.params;
    const proyecto = await Proyecto.findById(id).populate({
        path: 'tareas', populate: { path: 'completado', select:"nombre" }
    }).populate('colaboradores', 'nombre email')
    // Por si envio un id de proyecto no valido
    if (!proyecto) {
        const error = new Error("No encontrado");
        return res.status(404).json({ msg: error.message });
    }

    // Accediendo a el proyecto solo si es creador
    if (proyecto.creador.toString() !== req.usuario._id.toString() &&
        !proyecto.colaboradores.some(colaborador => colaborador._id.toString() === req.usuario._id.toString())) {
        const error = new Error("Accion no valida");
        return res.status(404).json({ msg: error.message });
    }

    // Obtener las tareas que pertenecen al proyecto
    // const tareas = await Tarea.find().where('proyecto').equals(proyecto._id);

    return res.json(proyecto);
};
const editarProyecto = async (req = request, res = response) => {
    const { id } = req.params;
    const proyecto = await Proyecto.findById(id);
    // Por si envio un id de proyecto no valido
    if (!proyecto) {
        const error = new Error("No encontrado");
        return res.status(404).json({ msg: error.message });
    }

    // Editanto el proyecto solo si es creador
    if (proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error("Accion no valida");
        return res.status(404).json({ msg: error.message });
    }

    proyecto.nombre = req.body.nombre || proyecto.nombre
    proyecto.descripcion = req.body.descripcion || proyecto.descripcion
    proyecto.fechaEntrega = req.body.fechaEntrega || proyecto.fechaEntrega
    proyecto.cliente = req.body.cliente || proyecto.cliente

    try {
        const proyectoAlmacenado = await proyecto.save();
        return res.json(proyectoAlmacenado);
    } catch (error) {
        console.log(error)
    }
};
const eliminarProyecto = async (req = request, res = response) => {
    const { id } = req.params;
    const proyecto = await Proyecto.findById(id);
    // Por si envio un id de proyecto no valido
    if (!proyecto) {
        const error = new Error("No encontrado");
        return res.status(404).json({ msg: error.message });
    }

    // Editanto el proyecto solo si es creador
    if (proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error("Accion no valida");
        return res.status(404).json({ msg: error.message });
    }

    try {
        await proyecto.deleteOne();
        res.json({ msg: "Proyecto Eliminado" });
    } catch (error) {
        console.log(error);
    }
};

const buscarColaborador = async (req = request, res = response) => {
    const { email } = req.body

    const usuario = await Usuario.findOne({ email }).select('-confirmado -createdAt -updatedAt -token -password -__v')

    if (!usuario) {
        const error = new Error("Usuario no encontrado")
        return res.status(404).json({ msg: error.message })
    }

    res.json(usuario)
}

const agregarColaborador = async (req = request, res = response) => {
    // Encontrado el proyecto
    const proyecto = await Proyecto.findById(req.params.id)

    if (!proyecto) {
        const error = new Error("Proyecto no encontrado")
        return res.status(404).json({ msg: error.message })
    }

    if (proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error("Accion no valida")
        return res.status(404).json({ msg: error.message })
    }

    // Validando al usuario
    const { email } = req.body

    const usuario = await Usuario.findOne({ email }).select('-confirmado -createdAt -updatedAt -token -password -__v')

    if (!usuario) {
        const error = new Error("Usuario no encontrado")
        return res.status(404).json({ msg: error.message })
    }

    // El colaborador no puede ser admin del proyecto
    if (proyecto.creador.toString() === usuario._id.toString()) {
        const error = new Error("El creador del proyecto no puede ser colaborador")
        return res.status(404).json({ msg: error.message })
    }
    // Revisar que el colaborador ya este agregado al proyecto
    if (proyecto.colaboradores.includes(usuario._id)) {
        const error = new Error("El usuario ya se encuentra en el proyecto")
        return res.status(404).json({ msg: error.message })
    }
    // Agregamos al colaborador
    proyecto.colaboradores.push(usuario._id)
    await proyecto.save()
    return res.json({ msg: "Colaborador agregado correctamente" })
};
const eliminarColaborador = async (req = request, res = response) => {
    // Encontrado el proyecto
    const proyecto = await Proyecto.findById(req.params.id)

    if (!proyecto) {
        const error = new Error("Proyecto no encontrado")
        return res.status(404).json({ msg: error.message })
    }

    if (proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error("Accion no valida")
        return res.status(404).json({ msg: error.message })
    }

    // Eliminamos al colaborador
    proyecto.colaboradores.pull(req.body.id)
    await proyecto.save()
    return res.json({ msg: "Colaborador Eliminado correctamente" })
};

export {
    obtenerProyectos,
    nuevoProyecto,
    obtenerProyecto,
    editarProyecto,
    eliminarProyecto,
    agregarColaborador,
    eliminarColaborador,
    buscarColaborador
}