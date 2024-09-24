import { useEffect } from "react";
import Alerta from "../../components/Alerta"
import useProyectos from "../../hook/useProyectos"
import PreviewProyecto from "./PreviewProyecto"
import io from 'socket.io-client'

let socket;

const Proyectos = () => {
  const { proyectos, alerta } = useProyectos()
  const { msg } = alerta

  useEffect(() => {
    socket = io(import.meta.env.VITE_BACKEND_URL)


  }, [])

  return (
    <>
      <h1 className="text-4xl font-black">Proyectos</h1>
      {msg && <Alerta alerta={alerta} />}

      <div className="bg-white shadow mt-10 rounded-lg">
        {proyectos.length ? (
          proyectos.map(proyecto => (
            <PreviewProyecto
              key={proyecto._id}
              proyecto={proyecto} />
          ))
        ) : <p className="mt-5 text-center text-gray-600 uppercase p-5 font-bold">No hay proyectos aun</p>}
      </div>
    </>
  )
}

export default Proyectos