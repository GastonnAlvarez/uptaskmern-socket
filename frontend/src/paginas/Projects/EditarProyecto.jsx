import { useEffect } from "react"
import useProyectos from "../../hook/useProyectos"
import FormularioProyecto from '../../paginas/Projects/FormularioProyecto'
import { useParams } from "react-router-dom"

const EditarProyecto = () => {
    const params = useParams()
    const { proyecto, cargando, obtenerProyecto, eliminarProyecto } = useProyectos()

    useEffect(() => {
        obtenerProyecto(params.id)
    }, [])

    const handleClick = () => {
        eliminarProyecto(params.id)
    }

    if (cargando) return 'Cargando...'

    const { nombre } = proyecto

    return (
        <>
            <h1 className="text-4xl font-black">Editar proyecto: {nombre}</h1>
            <div className='flex justify-between items-center'>
                <h1 className='text-4xl font-black'>{nombre}</h1>
                <button
                    onClick={handleClick}
                    className='flex justify-between items-center py-3 px-5 text-white rounded-lg gap-3 bg-indigo-500 hover:bg-indigo-950 transition-colors'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                    <p>Eliminar</p>
                </button>
            </div>
            <div className="mt-10 flex justify-start">
                <FormularioProyecto />
            </div>
        </>
    )
}

export default EditarProyecto