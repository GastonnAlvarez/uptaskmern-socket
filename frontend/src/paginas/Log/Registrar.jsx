import { useState } from 'react'
import { Link } from 'react-router-dom'
import Alerta from '../../components/Alerta'
import axios from 'axios'
import clienteAxios from '../../config/clienteAxios'

const Registrar = () => {
    const [nombre, setNombre] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [repetirPassword, setRepetirPassword] = useState('')
    const [alerta, setAlerta] = useState([])

    const handleSubmit = async e => {
        e.preventDefault()

        if ([nombre, email, password, repetirPassword].includes('')) {
            setAlerta({
                error: true,
                msg: "Todos los campos son obligatorios"
            })
            return
        }

        if (password !== repetirPassword) {
            setAlerta({
                error: true,
                msg: "Los password no son iguales"
            })
            return
        }

        if (password.length < 6) {
            setAlerta({
                error: true,
                msg: "El password es muy corto, el minimo es 6 caracteres"
            })
            return
        }
        setAlerta([])

        try {
            const { data } = await clienteAxios.post(`/usuarios`, { nombre, email, password })
            setAlerta({
                error: false,
                msg: data.msg
            })
            setNombre('')
            setEmail('')
            setPassword('')
            setRepetirPassword('')
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
            <div className='text-sky-600 text-6xl font-black capitalize'>Registrate y Administra tus <span className='text-slate-700'>Proyectos</span></div>

            <form className='my-10 bg-white shadow rounded-lg px-10 py-5'
                onSubmit={handleSubmit}>
                {msg && <Alerta alerta={alerta} />}
                <div className='my-5'>
                    <label htmlFor="nombre" className='uppercase text-gray-600 block text-xl font-bold'>nombre</label>
                    <input
                        id='nombre'
                        type="text"
                        placeholder='Ingresa tu nombre'
                        className='w-full mt-3 p-3 border rounded-xl bg-gray-50 mb-5'
                        value={nombre}
                        onChange={e => setNombre(e.target.value)} />
                </div>
                <div className='my-5'>
                    <label htmlFor="email" className='uppercase text-gray-600 block text-xl font-bold'>Email</label>
                    <input
                        id='email'
                        type="email"
                        placeholder='Ingresa tu Email'
                        className='w-full mt-3 p-3 border rounded-xl bg-gray-50 mb-5'
                        value={email}
                        onChange={e => setEmail(e.target.value)} />
                </div>
                <div className='my-5'>
                    <label htmlFor="password" className='uppercase text-gray-600 block text-xl font-bold'>Password</label>
                    <input
                        id='password'
                        type="password"
                        placeholder='Ingresa tu password'
                        className='w-full mt-3 p-3 border rounded-xl bg-gray-50 '
                        value={password}
                        onChange={e => setPassword(e.target.value)} />
                </div>
                <div className='my-5'>
                    <label htmlFor="password2" className='uppercase text-gray-600 block text-xl font-bold'>Repetir Password</label>
                    <input
                        id='password2'
                        type="password"
                        placeholder='Repite tu password'
                        className='w-full mt-3 p-3 border rounded-xl bg-gray-50 '
                        value={repetirPassword}
                        onChange={e => setRepetirPassword(e.target.value)} />
                </div>

                <input type="submit"
                    value="Registrar"
                    className='bg-sky-700 w-full py-3 text-white uppercase font-bold rounded-xl hover:cursor-pointer hover:bg-sky-800 transition-colors' />
            </form>

            <nav className='lg:flex lg:justify-between'>
                <Link
                    className='block my-5 text-center text-slate-500 uppercase text-sm'
                    to='/'
                >Tienes una cuenta? Inicia Sesion</Link>
                <Link
                    className='block my-5 text-center text-slate-500 uppercase text-sm'
                    to='/olvide-password'
                >Olvide mi Password</Link>
            </nav>
        </>
    )
}

export default Registrar