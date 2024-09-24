import { Link } from "react-router-dom"
import useAuth from '../../hook/useAuth'

const PreviewProyecto = ({ proyecto }) => {
    const { cliente, nombre, _id, creador } = proyecto
    const { auth } = useAuth()

    return (
        <div className='border-b p-5 flex flex-col md:flex-row items-center justify-between'>
            <p className="flex gap-3 items-center">{nombre}
                <span className="text-gray-400 uppercase font-bold">{" "} {cliente}</span>
                {auth._id !== creador && (
                    <p className="p-2 text-xs rounded-lg text-white bg-green-500 font-bold uppercase">Colaborador</p>
                )}
            </p>

            <Link
                to={`${_id}`}
                className="text-gray-600 hover:text-gray-950 uppercase text-sm font-bold"
            >Ver Proyecto</Link>
        </div>
    )
}

export default PreviewProyecto