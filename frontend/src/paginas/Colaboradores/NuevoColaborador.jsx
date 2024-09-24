import { useEffect } from "react"
import FormularioColaborador from "./FormularioColaborador"
import useProyectos from "../../hook/useProyectos"
import { useParams } from "react-router-dom"

const NuevoColaborador = () => {

  const { obtenerProyecto, proyecto, cargando, colaborador, agregarColaborador, alerta } = useProyectos()
  const params = useParams()

  useEffect(() => {
    obtenerProyecto(params.id)
  }, [])

  if (!proyecto?._id) return <Alerta alerta={alerta} />

  return (
    <>
      <div className='text-4xl font-black'>Añadir Nuevo Colaborador(a) al Proyecto:{proyecto.nombre}</div>
      <div className='mt-10 flex justify-start'>
        <FormularioColaborador />
      </div>

      {cargando ? "Cargando..." : colaborador?._id && (
        <div className="flex justify-center mt-10">
          <div className="bg-white py-10 px-5 w-full md:w-1/2 rounded-lg shadow">
            <h2 className="text-center mb-10 text-2xl font-bold">Resultado:</h2>
            <div className="flex justify-between items-center">
              <p>{colaborador.nombre}</p>
              <button
                type="button"
                className="bg-slate-500 px-5 py-2 rounded-lg uppercase text-white font-bold text-sm"
                onClick={() => agregarColaborador({
                  email: colaborador.email
                })}
              >Agregar al proyecto</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default NuevoColaborador