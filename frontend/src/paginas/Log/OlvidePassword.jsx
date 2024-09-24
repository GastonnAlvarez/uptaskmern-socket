import { useState } from "react"
import { Link } from "react-router-dom"
import Alerta from "../../components/Alerta"
import axios from "axios"
import clienteAxios from "../../config/clienteAxios"

const OlvidePassword = () => {
  const [email, setEmail] = useState('')
  const [alerta, setAlerta] = useState([])

  const handleSubmit = async e => {
    e.preventDefault()

    if (email === '' || email.length < 6) {
      setAlerta({
        error: true,
        msg: "El email es obligatorio"
      })
      return
    }

    try {
      const { data } = await clienteAxios.post(`/usuarios/olvide-password`, { email })
      setAlerta({
        error: false,
        msg: data.msg
      })
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

      <form className='my-10 bg-white shadow rounded-lg px-10 py-5'
        onSubmit={handleSubmit}>

        <div className='my-5'>
          <label htmlFor="email" className='uppercase text-gray-600 block text-xl font-bold'>Email</label>
          <input
            id='email'
            type="email"
            name="email"
            placeholder='Ingresa tu Email'
            className='w-full mt-3 p-3 border rounded-xl bg-gray-50 mb-5'
            onChange={e => setEmail(e.target.value)}
            value={email} />
        </div>

        <input type="submit"
          value="Enviar Instrucciones"
          className='bg-sky-700 w-full py-3 text-white uppercase font-bold rounded-xl hover:cursor-pointer hover:bg-sky-800 transition-colors' />
      </form>

      <nav className='lg:flex lg:justify-between'>
        <Link
          className='block my-5 text-center text-slate-500 uppercase text-sm'
          to='/'
        >Tienes una cuenta? Inicia Sesion</Link>
        <Link
          className='block my-5 text-center text-slate-500 uppercase text-sm'
          to='/registrar'
        >No tienes una cuenta? Registrate</Link>
      </nav>
    </>
  )
}

export default OlvidePassword