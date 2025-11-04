import { Outlet,useNavigate } from "react-router-dom"
import siempreLogo from '../../assets/logos/logo-siempre.png'

export default function Main(){
    /* Hacer función ir a home con useNavigate */
    const navigate = useNavigate()

    const goHome = () => {
        navigate('/') // redirige al PackagesForm
    }

    return <main className="page-content">
        <header className='main-header'><img onClick={goHome} src={siempreLogo} alt="Logo Siempre" /></header>
        <main className="main-content">
            <Outlet />
        </main>
    </main>
}