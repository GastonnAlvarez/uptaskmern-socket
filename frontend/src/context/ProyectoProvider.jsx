import { useState, useEffect, createContext } from "react"
import clienteAxios from "../config/clienteAxios"
import { useNavigate } from 'react-router-dom'
import io from 'socket.io-client'
import useAuth from "../hook/useAuth"

let socket

const ProyectoContext = createContext()

const ProyectosProvider = ({ children }) => {
    const [proyectos, setProyectos] = useState([])
    const [alerta, setAlerta] = useState({})
    const [proyecto, setProyecto] = useState({})
    const [cargando, setCargando] = useState(false)
    const [modalFormularioTarea, setModalFormularioTarea] = useState(false)
    const [tarea, setTarea] = useState({})
    const [modalEliminarTarea, setModalEliminarTarea] = useState(false)
    const [colaborador, setColaborador] = useState({})
    const [modalEliminarColaborador, setModalEliminarColaborador] = useState(false)
    const [buscador, setBuscador] = useState(false)

    const { auth } = useAuth()

    // Conexion a socket.io
    useEffect(() => {
        socket = io(import.meta.env.VITE_BACKEND_URL)
    }, [])

    const navigate = useNavigate()

    // Listar todos los proyectos en '/proyectos/
    useEffect(() => {
        const obtenerProyectos = async () => {
            try {
                const token = localStorage.getItem('token')
                if (!token) return

                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }

                const { data } = await clienteAxios('/proyectos', config)

                setProyectos(data)
                setAlerta({})

            } catch (error) {
                console.log(error)
            }
        }

        obtenerProyectos()
    }, [auth])

    const mostrarAlerta = alerta => {
        setAlerta(alerta)

        setTimeout(() => {
            setAlerta([])
        }, 3000)
    }

    // Crear un proyecto o Editar
    const submitProyecto = async proyecto => {
        if (proyecto.id) {
            await editarProyecto(proyecto)
        } else {
            await nuevoProyecto(proyecto)
        }

    }

    const editarProyecto = async proyecto => {
        try {
            const token = localStorage.getItem('token')
            if (!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.put(`/proyectos/${proyecto.id}`, proyecto, config)

            // Actualizar el state
            const proyectosActualizados = proyectos.map(proyectoState => proyectoState._id === data._id ? data : proyectoState)
            setProyectos(proyectosActualizados)

            // Mostrar alerta
            setAlerta({
                error: false,
                msg: "Proyecto Actualizado"
            })

        } catch (error) {
            console.log(error)
        }
    }

    const nuevoProyecto = async proyecto => {
        try {
            const token = localStorage.getItem('token')
            if (!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.post('/proyectos', proyecto, config)
            setProyectos([...proyectos, data])

            setAlerta({
                error: false,
                msg: "Proyecto creado correctamente"
            })

            setTimeout(() => {
                setAlerta([])
                navigate('/proyectos')
            }, 3000);

        } catch (error) {
            console.log(error)
        }
    }

    // Visualizacion de UN solo proyecto
    const obtenerProyecto = async id => {
        setCargando(true)
        try {
            const token = localStorage.getItem('token')
            if (!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios(`/proyectos/${id}`, config)
            setProyecto(data)
            setAlerta({})
        } catch (error) {
            navigate('/proyectos')
            setAlerta({
                error: true,
                msg: error.response.data.msg
            })
            setTimeout(() => {
                setAlerta({})
            }, 3000);
        }
        setCargando(false)
    }

    // Eliminar proyecto
    const eliminarProyecto = async id => {
        try {
            const token = localStorage.getItem('token')
            if (!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.delete(`/proyectos/${id}`, config)
            // Sincronizar el estado
            const proyectosActualizados = proyectos.filter(proyectoState => proyectoState._id !== id)

            setProyectos(proyectosActualizados)

            setAlerta({
                error: false,
                msg: data.msg
            })

            setTimeout(() => {
                setAlerta({})
                navigate('/proyectos')
            }, 3000);

        } catch (error) {
            console.log(error)
        }
    }
    // Manejo del Modal formulario tarea
    const handleModalTarea = () => {
        setModalFormularioTarea(!modalFormularioTarea)
        setTarea({})
    }

    // Creando una tarea o editando
    const submitTarea = async (tarea) => {
        if (tarea.id) {
            await editarTarea(tarea)
        } else {
            await crearTarea(tarea)
        }
    }

    const editarTarea = async tarea => {
        try {
            const token = localStorage.getItem('token')
            if (!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.put(`/tareas/${tarea.id}`, tarea, config)

            // SOCKET.IO
            socket.emit("actualizar tarea", data)

            setAlerta({})
            setModalFormularioTarea(false)
        } catch (error) {

        }
    }

    const crearTarea = async tarea => {
        try {
            const token = localStorage.getItem('token')
            if (!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.post('/tareas', tarea, config)


            setAlerta({})
            setModalFormularioTarea(false)
            // SCOKET.IO
            socket.emit('nueva tarea', data)
        } catch (error) {
            console.log(error)
        }
    }

    // Abriendo el modal y llenando el state de tarea
    const handleModalEditarTarea = tarea => {
        setTarea(tarea)
        setModalFormularioTarea(true)
    }

    // Eliminar una tarea con el modal
    const handleModalEliminarTarea = tarea => {
        setTarea(tarea)
        setModalEliminarTarea(!modalEliminarTarea)
    }

    const eliminarTarea = async () => {
        try {
            const token = localStorage.getItem('token')
            if (!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.delete(`/tareas/${tarea._id}`, config)
            setAlerta({
                error: false,
                msg: data.msg
            })


            // SOCKET.IO
            socket.emit("eliminar tarea", tarea)
            setTarea({})
            setModalEliminarTarea(false)
            setTimeout(() => {
                setAlerta({})
            }, 3000);


        } catch (error) {
            console.log(error)
        }
    }

    // Enviar Colaborador
    const submitColaborador = async email => {
        setCargando(true)
        try {
            const token = localStorage.getItem('token')
            if (!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.post('/proyectos/colaboradores', { email }, config)
            setColaborador(data)
            setAlerta({})
        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        }
        setCargando(false)
    }
    // Agregar Colaborador
    const agregarColaborador = async email => {

        try {
            const token = localStorage.getItem('token')
            if (!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.post(`/proyectos/colaboradores/${proyecto._id}`, email, config)

            setAlerta({
                error: false,
                msg: data.msg
            })

            setTimeout(() => {
                setAlerta({})
                setColaborador({})
            }, 3000);

        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        }
    }

    // Activando el modal para eliminar un colaborador
    const handleModalEliminarColaborador = (colaborador) => {
        setModalEliminarColaborador(!modalEliminarColaborador)

        setColaborador(colaborador)
    }

    // Eliminar el colaborador
    const eliminarColaborador = async () => {
        try {
            const token = localStorage.getItem('token')
            if (!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.post(`/proyectos/eliminar-colaborador/${proyecto._id}`, { id: colaborador._id }, config)


            const proyectoActualizado = { ...proyecto }

            proyectoActualizado.colaboradores = proyectoActualizado.colaboradores.filter(colaboradorState => colaboradorState._id !== colaborador._id)

            setAlerta({
                msg: data.msg,
                error: false
            })
            setColaborador({})
            setProyecto(proyectoActualizado)
            setModalEliminarColaborador(false)

            setTimeout(() => {
                setAlerta({})
            }, 3000);
        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        }
    }

    const completarTarea = async id => {
        try {
            const token = localStorage.getItem('token')
            if (!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.post(`/tareas/estado/${id}`, {}, config)

            setTarea({})
            setAlerta({})
            // SOCKET.IO
            socket.emit("completar tarea", data)


        } catch (error) {
            console.log(error.response)
        }
    }

    // Buscador de proyectos
    const handleBuscador = () => {
        setBuscador(!buscador)
    }


    // SOCKET.IO
    const submitTareasProyecto = (tarea) => {
        const proyectoActualizado = { ...proyecto }
        proyectoActualizado.tareas = [...proyectoActualizado.tareas, tarea]

        setProyecto(proyectoActualizado)
    }

    const eliminarTareaProyecto = (tarea) => {
        const proyectoActualizado = { ...proyecto }
        proyectoActualizado.tareas = proyectoActualizado.tareas.filter(tareaState => tareaState._id !== tarea._id)
        setProyecto(proyectoActualizado)
    }

    const actualizarTareaProyecto = (tarea) => {
        const proyectoActualizado = { ...proyecto }
        proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState => tareaState._id === tarea._id ? tarea : tareaState)
        setProyecto(proyectoActualizado)
    }

    const completarTareaProyecto = (tarea) => {
        const proyectoActualizado = { ...proyecto }
        proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState => tareaState._id === tarea._id ? tarea : tareaState)
        setProyecto(proyectoActualizado)
    }

    const cerrarSesionProyecto = () => {
        setProyectos([])
        setProyecto({})
        setAlerta({})
    }

    return (
        <ProyectoContext.Provider value={{
            proyectos,
            mostrarAlerta,
            alerta,
            submitProyecto,
            obtenerProyecto,
            proyecto,
            cargando,
            eliminarProyecto,
            modalFormularioTarea,
            handleModalTarea,
            submitTarea,
            handleModalEditarTarea,
            tarea,
            modalEliminarTarea,
            handleModalEliminarTarea,
            eliminarTarea,
            submitColaborador,
            colaborador,
            agregarColaborador,
            handleModalEliminarColaborador,
            modalEliminarColaborador,
            eliminarColaborador,
            completarTarea,
            handleBuscador,
            buscador,
            submitTareasProyecto,
            eliminarTareaProyecto,
            actualizarTareaProyecto,
            completarTareaProyecto,
            cerrarSesionProyecto
        }}>
            {children}
        </ProyectoContext.Provider>
    )
}

export { ProyectosProvider }
export default ProyectoContext