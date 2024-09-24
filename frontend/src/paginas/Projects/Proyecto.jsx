import { Link, useParams } from 'react-router-dom'
import useProyecto from '../../hook/useProyectos'
import useAdmin from '../../hook/useAdmin'
import { useEffect } from 'react'
import ModalFormularioTarea from '../../components/ModalFormularioTarea'
import Tarea from '../../components/Tarea'
import ModalEliminarTarea from '../../components/ModalEliminarTarea'
import Colaborador from '../Colaboradores/Colaborador'
import ModalEliminarColaborador from '../Colaboradores/ModalEliminarColaborador'
import io from 'socket.io-client'
let socket
const Proyecto = () => {
    const params = useParams()

    const { obtenerProyecto,
        proyecto,
        cargando,
        handleModalTarea,
        submitTareasProyecto,
        eliminarTareaProyecto,
        actualizarTareaProyecto,
        completarTareaProyecto } = useProyecto()

    useEffect(() => {
        obtenerProyecto(params.id)
    }, [])

    // Socket.io
    useEffect(() => {
        socket = io(import.meta.env.VITE_BACKEND_URL)
        socket.emit("abrir proyecto", params.id)
    }, [])

    useEffect(() => {
        socket.on('tarea agregada', tareaNueva => {
            if (tareaNueva.proyecto === proyecto._id) {
                submitTareasProyecto(tareaNueva)
            }
        })

        socket.on('tarea eliminada', tareaEliminada => {
            if (tareaEliminada.proyecto === proyecto._id) {
                eliminarTareaProyecto(tareaEliminada)
            }
        })
        socket.on('tarea editada', tareaActualizada => {
            if (tareaActualizada.proyecto._id === proyecto._id) {
                actualizarTareaProyecto(tareaActualizada)
            }
        })
        socket.on('tarea completada', tareaCompletada => {
            if (tareaCompletada.proyecto._id === proyecto._id) {
                completarTareaProyecto(tareaCompletada)
            }
        })
    })

    const { nombre } = proyecto

    if (cargando) return "Cargando..."


    const admin = useAdmin()



    return (
        <>
            <div className='flex justify-between items-center'>
                <h1 className='text-4xl font-black'>{nombre}</h1>
                {admin && (
                    <Link
                        to={`/proyectos/editar/${params.id}`}
                        className='flex justify-between items-center py-3 px-5 text-white rounded-lg gap-3 bg-indigo-500 hover:bg-indigo-950 transition-colors'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                        </svg>
                        <p>Editar</p>
                    </Link>
                )}
            </div>
            {admin && (
                <button
                    onClick={handleModalTarea}
                    className='text-sm px-5 py-3 w-full md:w-auto rounded-lg uppercase font-bold bg-sky-400 text-white mt-5 text-center flex gap-3 items-center'
                    type='button'
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>

                    <p>Nueva Tarea</p>
                </button>
            )}

            <p className='font-bold text-xl mt-10'>Tareas del proyecto</p>

            <div className='bg-white shadow rounded-lg mt-10'>
                {proyecto.tareas?.length ? (
                    proyecto.tareas?.map(tarea => (
                        <Tarea key={tarea.nombre} tarea={tarea} />
                    ))
                ) : <p className='font-black text-xl text-center p-3'>No hay tareas</p>}
            </div>

            {admin && (
                <div className='flex items-center justify-between mt-10'>
                    <p className='font-black text-xl mt-5 p-3'>Colaboradores</p>
                    <Link
                        to={`/proyectos/nuevo-colaborador/${proyecto._id}`}
                        className='text-gray-400 hover:text-gray-950 uppercase font-bold'
                    >Añadir</Link>
                </div>
            )}

            <div className='bg-white shadow rounded-lg mt-10'>
                {proyecto.colaboradores?.length ? (
                    proyecto.colaboradores?.map(colaborador => (
                        <Colaborador key={colaborador.nombre} colaborador={colaborador} />
                    ))
                ) : <p className='font-black text-xl text-center p-3'>No hay tareas</p>}
            </div>

            <ModalFormularioTarea />
            <ModalEliminarTarea />
            <ModalEliminarColaborador />
        </>
    )
}

export default Proyecto