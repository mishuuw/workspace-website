import { useAuth } from '../../features/auth/useAuth.jsx'
import logo from '../assets/logo.jpg'
import "./navBar.css"

function navBar() {
  let { isAuthenticated, logout } = useAuth()

  let btn_login = <a role="button" className="btn_login" href="/login/">
                    <div>Вход</div>
                  </a>
  let btn_logout = <a role="button" className="btn_login" href="javascript:void(0);" onClick={logout}>
                    <div>Выход</div>
                  </a>

  return (
    <>
      <div className="white_topbar">
        <a className="logo" href="/">
          <img src={logo} alt="logo" className="logo_img" />
        </a>
        
        {isAuthenticated && btn_logout || btn_login}
        
        <a role="button" className="btn_register"href="/register/">
          <div>Регистрация</div>
        </a>
      </div>
    </>
  )
}
export default navBar