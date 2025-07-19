import { useAuth } from '../../features/auth/useAuth'
import logo from '../assets/logo.jpg'
import "./navBar.css"

function navBar() {
  return (
    <>
      <div className="white_topbar">
        <a className="logo" href="/">
          <img src={logo} alt="logo" className="logo_img" />
        </a>
        <a role="button" className="btn_login" href="/login/">
          <div>Вход</div>
        </a>
        <a role="button" className="btn_register"href="/register/">
          <div>Регистрация</div>
        </a>
      </div>
    </>
  )
}
export default navBar