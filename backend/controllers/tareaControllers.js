import Proyecto from '../models/Proyecto.js'
import Tarea from '../models/Tarea.js'

const agregarTarea = async (req, res) => {
    const { proyecto } = req.body;

    const proyectoExiste = await Proyecto.findById(proyecto);

    if (!proyectoExiste) {
        const error = new Error("No existe el proyecto");
        res.status(404).json({ msg: error.message });
    }

    if (proyectoExiste.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error("No tienes los permisos para añadir tareas");
        res.status(404).json({ msg: error.message });
    }

    try {
        const tareaAlmacenada = await Tarea.create(req.body);

        proyectoExiste.tareas.push(tareaAlmacenada._id)
        await proyectoExiste.save()
        return res.json(tareaAlmacenada);
    } catch (error) {
        console.log(error)
    }
};
const obtenerTarea = async (req, res) => {
    const { id } = req.params;

    const tarea = await Tarea.findById(id).populate("proyecto");

    if (!tarea) {
        const error = new Error("Tarea no encontrada");
        res.status(404).json({ msg: error.message });
    }

    if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error("Accion no permitida");
        res.status(404).json({ msg: error.message });
    }

    try {
        res.json(tarea);
    } catch (error) {
        console.log(error)
    }
};
const actualizarTarea = async (req, res) => {
    const { id } = req.params;

    const tarea = await Tarea.findById(id).populate("proyecto");

    if (!tarea) {
        const error = new Error("Tarea no encontrada");
        res.status(404).json({ msg: error.message });
    }

    if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error("Accion no permitida");
        res.status(404).json({ msg: error.message });
    }

    tarea.nombre = req.body.nombre || tarea.nombre;
    tarea.descripcion = req.body.descripcion || tarea.descripcion;
    tarea.fechaEntrega = req.body.fechaEntrega || tarea.fechaEntrega;
    tarea.prioridad = req.body.prioridad || tarea.prioridad;

    try {
        const tareaAlmacenada = await tarea.save();
        res.json(tareaAlmacenada);
    } catch (error) {
        console.log(error)
    }
};
const eliminarTarea = async (req, res) => {
    const { id } = req.params;

    const tarea = await Tarea.findById(id).populate("proyecto");

    if (!tarea) {
        const error = new Error("Tarea no encontrada");
        res.status(404).json({ msg: error.message });
    }

    if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error("Accion no permitida");
        res.status(404).json({ msg: error.message });
    }

    try {
        const proyecto = await Proyecto.findById(tarea.proyecto)
        await Promise.allSettled([
            await proyecto.save(),
            await tarea.deleteOne()
        ])
        return res.json({ msg: "La tarea se elimino" })
    } catch (error) {
        console.log(error)
    }
};
const cambiarEstado = async (req, res) => {
    const { id } = req.params;

    const tarea = await Tarea.findById(id).populate("proyecto");
    if (!tarea) {
        const error = new Error("Tarea no encontrada");
        res.status(404).json({ msg: error.message });
    }

    if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()
        && !tarea.proyecto.colaboradores.some(colaborador => colaborador._id.toString() === req.usuario._id.toString())) {
        const error = new Error("Accion no permitida");
        res.status(404).json({ msg: error.message });
    }

    tarea.estado = !tarea.estado
    tarea.completado = req.usuario._id
    await tarea.save()

    const tareaAlmacenada = await Tarea.findById(id).populate("proyecto").populate('completado')
    res.json(tareaAlmacenada)

};

export {
    agregarTarea,
    obtenerTarea,
    actualizarTarea,
    eliminarTarea,
    cambiarEstado,
}