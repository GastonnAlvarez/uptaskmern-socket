import { useState, useEffect } from "react"
import { useParams, Link } from 'react-router-dom'
import axios from "axios"
import Alerta from "../../components/Alerta"
import clienteAxios from "../../config/clienteAxios"

const ConfirmarCuenta = () => {
  const [alerta, setAlerta] = useState('')
  const [cuentaConfirmada, setConfirmarCuenta] = useState(false)

  const params = useParams()
  const { id } = params

  useEffect(() => {
    const confirmarCuenta = async () => {
      try {
        const url = `/usuarios/confirmar/${id}`
        const { data } = await clienteAxios(url)

        setAlerta({
          error: false,
          msg: data.msg
        })
        setConfirmarCuenta(true)
      } catch (error) {
        setAlerta({
          error: true,
          msg: error.response.data.msg
        })
      }
    }

    confirmarCuenta()
  }, [])

  const { msg } = alerta

  return (
    <>
      <div className='text-sky-600 text-6xl font-black capitalize mb-5'>Confirma tu cuenta y comienza a crear tus<span className='text-slate-700'>Proyectos</span></div>
      {cuentaConfirmada ? (
        <Link to='/' className="uppercase font-bold text-slate-500 hover:text-slate-950 cursor-pointer text-xl mt-5">Se confirmo correctamente tu cuenta, inicia sesion</Link>
      ):(
        <Alerta alerta={alerta} />
      )}
    </>
  )
}

export default ConfirmarCuenta