import { Link, useNavigate } from 'react-router-dom'
import Alerta from '../../components/Alerta'
import clienteAxios from '../../config/clienteAxios'
import { useState } from 'react'
import useAuth from '../../hook/useAuth'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [alerta, setAlerta] = useState([])

  const navigate = useNavigate()

  const { setAuth, auth, cargando } = useAuth()

  const handleSubmit = async e => {
    e.preventDefault()

    if ([email, password].includes('')) {
      setAlerta({
        error: true,
        msg: "Todos los campos son obligatorios"
      })
      return
    }

    try {
      const { data } = await clienteAxios.post('/usuarios/login', { email, password })

      localStorage.setItem('token', data.token)
      setAuth(data)
      navigate('/proyectos')
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
      <div className='text-sky-600 text-6xl font-black capitalize'>Inicia Sesion y Administra tus <span className='text-slate-700'>Proyectos</span></div>

      {msg && <Alerta alerta={alerta} />}

      <form className='my-10 bg-white shadow rounded-lg px-10 py-5'
        onSubmit={handleSubmit}>
        <div className='my-5'>
          <label htmlFor="email" className='uppercase text-gray-600 block text-xl font-bold'>Email</label>
          <input
            id='email'
            type="email"
            placeholder='Ingresa tu Email'
            onChange={e => setEmail(e.target.value)}
            value={email}
            className='w-full mt-3 p-3 border rounded-xl bg-gray-50 mb-5' />
        </div>
        <div className='my-5'>
          <label htmlFor="password" className='uppercase text-gray-600 block text-xl font-bold'>Password</label>
          <input
            id='password'
            type="password"
            placeholder='Ingresa tu password'
            onChange={e => setPassword(e.target.value)}
            value={password}
            className='w-full mt-3 p-3 border rounded-xl bg-gray-50 ' />
        </div>

        <input type="submit"
          value="Iniciar Sesion"
          className='bg-sky-700 w-full py-3 text-white uppercase font-bold rounded-xl hover:cursor-pointer hover:bg-sky-800 transition-colors' />
      </form>

      <nav className='lg:flex lg:justify-between'>
        <Link
          className='block my-5 text-center text-slate-500 uppercase text-sm'
          to='/registrar'
        >No tienes una cuenta? Registrate</Link>
        <Link
          className='block my-5 text-center text-slate-500 uppercase text-sm'
          to='/olvide-password'
        >Olvide mi Password</Link>
      </nav>
    </>
  )
}

export default Login