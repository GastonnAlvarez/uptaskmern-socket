import useAuth from "./useAuth";
import useProyectos from "./useProyectos";

const useAdmin = () => {
    const { auth } = useAuth()
    const { proyecto } = useProyectos()

    return proyecto.creador === auth._id
}

export default useAdmin