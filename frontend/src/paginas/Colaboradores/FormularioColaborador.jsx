import { useState } from "react"
import useProyectos from "../../hook/useProyectos"
import Alerta from "../../components/Alerta"

const FormularioColaborador = () => {
    const [email, setEmail] = useState('')

    const { alerta, mostrarAlerta, submitColaborador } = useProyectos()

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (email === '') {
            mostrarAlerta({
                msg: 'El email es obligatorio',
                error: true
            })
            return
        }

        await submitColaborador(email)
    }

    const { msg } = alerta

    return (
        <form
            className="bg-white py-10 px-5 md:w-1/2 rounded-lg shadow"
            onSubmit={handleSubmit}>
            {msg && <Alerta alerta={alerta} />}
            <div className='mb-5'>
                <label
                    className='text-gray-700 uppercase font-bold text-sm'
                    htmlFor='email'
                >
                    Email Colaborador
                </label>
                <input
                    type="email"
                    id="email"
                    placeholder='Email del colaborador'
                    className='border-2 w-full p-2 mt-2 placeholder-slate-400 rounded-md'
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
            </div>
            <input
                type="submit"
                className='bg-sky-400 hover:bg-sky-600 w-full p-3 text-white uppercase font-bold cursor-pointer transition-colors rounded-lg'
                value='Añadir colaborador'
            />
        </form>
    )
}

export default FormularioColaborador