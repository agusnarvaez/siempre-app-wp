import { Outlet } from "react-router-dom"
import siempreLogo from '../../assets/logos/logo-siempre.png'

export default function Main(){
    return <main className="page-content">
        <header className='main-header'><img src={siempreLogo} alt="Logo Siempre" /></header>
        <main className="main-content">
            <Outlet />
        </main>
    </main>
}