import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar/Navbar.jsx'
import Footer from '../components/Footer/Footer.jsx'

export default function Layout() {
  return (
    <div className="app-shell">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
