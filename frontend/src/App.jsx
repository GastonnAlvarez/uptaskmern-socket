import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AuthLayout from './layouts/AuthLayout'
import Login from './paginas/Log/Login'
import Registrar from './paginas/Log/Registrar'
import OlvidePassword from './paginas/Log/OlvidePassword'
import NuevoPassword from './paginas/Log/NuevoPassword'
import ConfirmarCuenta from './paginas/Log/ConfirmarCuenta'
// Provider
import { AuthProvider } from './context/AuthProvider'
import { ProyectosProvider } from './context/ProyectoProvider'
import RutaProtegida from './layouts/RutaProtegida'
import Proyectos from './paginas/Projects/Proyectos'
import NuevoProyecto from './paginas/Projects/NuevoProyecto'
import Proyecto from './paginas/Projects/Proyecto'
import EditarProyecto from './paginas/Projects/EditarProyecto'
import NuevoColaborador from './paginas/Colaboradores/NuevoColaborador'


function App() {

  return (
    <BrowserRouter>
      <AuthProvider>
        <ProyectosProvider>

          <Routes>
            <Route path='/' element={<AuthLayout />}>
              <Route index element={<Login />} />
              <Route path='registrar' element={<Registrar />} />
              <Route path='olvide-password' element={<OlvidePassword />} />
              <Route path='olvide-password/:token' element={<NuevoPassword />} />
              <Route path='confirmar/:id' element={<ConfirmarCuenta />} />
            </Route>

            <Route path='/proyectos' element={<RutaProtegida />}>
              <Route index element={<Proyectos />} />
              <Route path='crear-proyecto' element={<NuevoProyecto />} />
              <Route path=':id' element={<Proyecto />} />
              <Route path='editar/:id' element={<EditarProyecto />} />
              <Route path='nuevo-colaborador/:id' element={< NuevoColaborador />} />
            </Route>
          </Routes>

        </ProyectosProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
