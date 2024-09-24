import { useEffect, useState } from 'react'
import useProyectos from '../../hook/useProyectos'
import Alerta from '../../components/Alerta'
import { useParams } from 'react-router-dom'

const FormularioProyecto = () => {
    const [id, setId] = useState(null)
    const [nombre, setNombre] = useState('')
    const [descripcion, setDescripcion] = useState('')
    const [fechaEntrega, setFechaEntrega] = useState('')
    const [cliente, setCliente] = useState('')

    const params = useParams()

    const { mostrarAlerta, alerta, submitProyecto, proyecto } = useProyectos()
    // Verificando el accionar de editar o crear un proyecto
    useEffect(() => {
        if (params.id) {
            setId(proyecto._id)
            setNombre(proyecto.nombre)
            setDescripcion(proyecto.descripcion)
            setFechaEntrega(proyecto.fechaEntrega?.split('T')[0])
            setCliente(proyecto.cliente)
        }
    }, [params.id])


    const handleSubmit = async e => {
        e.preventDefault()

        if ([nombre, descripcion, fechaEntrega, cliente].includes('')) {
            mostrarAlerta({
                msg: 'Todos los campos son obligatorios',
                error: true
            })
            return
        }

        await submitProyecto({
            nombre, descripcion, fechaEntrega, cliente, id
        })

        setId(null)
        setNombre('')
        setDescripcion('')
        setFechaEntrega('')
        setCliente('')
    }

    const { msg } = alerta

    return (
        <form
            className='bg-white py-10 px-5 md:w-1/2 rounded-lg'
            onSubmit={handleSubmit}>
            {msg && <Alerta alerta={alerta} />}
            <div>
                <label htmlFor="nombre"
                    className='text-gray-700 uppercase font-bold text-sm'>Nombre del Proyecto</label>
                <input
                    id="nombre"
                    type="text"
                    className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md'
                    placeholder='Nombre del proyecto'
                    value={nombre}
                    onChange={e => setNombre(e.target.value)} />
            </div>
            <div>
                <label htmlFor="descripcion"
                    className='text-gray-700 uppercase font-bold text-sm'>Descripcion del Proyecto</label>
                <textarea
                    id="descripcion"
                    className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md'
                    placeholder='Descripcion del proyecto'
                    value={descripcion}
                    onChange={e => setDescripcion(e.target.value)} />
            </div>
            <div>
                <label htmlFor="fechaEntrega"
                    className='text-gray-700 uppercase font-bold text-sm'>Fecha de Entrega</label>
                <input
                    id="fechaEntrega"
                    type="date"
                    className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md'
                    value={fechaEntrega}
                    onChange={e => setFechaEntrega(e.target.value)} />
            </div>
            <div>
                <label htmlFor="cliente"
                    className='text-gray-700 uppercase font-bold text-sm'>Nombre del cliente</label>
                <input
                    id="cliente"
                    type="text"
                    className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md'
                    placeholder='Nombre del cliente'
                    value={cliente}
                    onChange={e => setCliente(e.target.value)} />
            </div>

            <input
                type="submit"
                value={id ? "Editar Proyecto" : "Crear Proyecto"}
                className='bg-sky-600 hover:bg-sky-950 transition-colors w-full p-3 uppercase font-bold text-white rounded-lg mt-5 cursor-pointer'
            />
        </form>
    )
}

export default FormularioProyecto