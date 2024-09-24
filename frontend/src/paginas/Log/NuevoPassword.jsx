import { Link, useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import Alerta from '../../components/Alerta'
import clienteAxios from "../../config/clienteAxios"

const NuevoPassword = () => {
  const [password, setPassword] = useState('')
  const [tokenValido, setTokenValido] = useState(false)
  const [alerta, setAlerta] = useState([])
  const [passwordModificado, setPasswordModificado] = useState(false)

  const params = useParams()

  const { token } = params

  useEffect(() => {
    const comprobarToken = async () => {
      try {
        await clienteAxios(`/usuarios/olvide-password/${token}`)
        setTokenValido(true)

      } catch (error) {
        setAlerta({
          error: true,
          msg: error.response.data.msg
        })
      }
    }

    comprobarToken()
  }, [])

  const handleSubmit = async e => {
    e.preventDefault()

    if (password.length < 6) {
      setAlerta({
        error: true,
        msg: "El password debe ser de minimo 6 caracteres"
      })
      return
    }

    try {
      const url = `/usuarios/olvide-password/${token}`

      const { data } = await clienteAxios.post(url, { password })
      setAlerta({
        error: false,
        msg: data.msg
      })
      setPasswordModificado(true)
    } catch (error) {
      setAlerta({
        error: true,
        msg: error.response.data.msg
      })
    }
  }

  const { msg } = alerta

  return (
    <>
      <div className='text-sky-600 text-6xl font-black capitalize'>Recupera tu password y no pierdas tus<span className='text-slate-700'>Proyectos</span></div>

      {msg && <Alerta alerta={alerta} />}

      {tokenValido && (
        <>
          <form className='my-10 bg-white shadow rounded-lg px-10 py-5'
            onSubmit={handleSubmit}>

            <div className='my-5'>
              <label htmlFor="password" className='uppercase text-gray-600 block text-xl font-bold'>Nuevo password</label>
              <input
                id='password'
                type="password"
                placeholder='Ingresa tu nuevo password'
                onChange={e => setPassword(e.target.value)}
                value={password}
                className='w-full mt-3 p-3 border rounded-xl bg-gray-50 mb-5' />
            </div>

            <input type="submit"
              value="Crear Nuevo Password"
              className='bg-sky-700 w-full py-3 text-white uppercase font-bold rounded-xl hover:cursor-pointer hover:bg-sky-800 transition-colors' />
          </form>

          {passwordModificado && (
            <nav className='flex justify-center'>
              <Link
                className='block my-5 text-center text-slate-500 uppercase text-sm'
                to='/'
              >Inicia Sesion</Link>
            </nav>
          )}
        </>
      )}


    </>
  )
}

export default NuevoPassword