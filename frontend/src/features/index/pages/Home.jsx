import "./Home.css"
import navBar from "../../../shared/components/navBar"

function Home() {

  return (
    <>
      {navBar()}
      <div className="about">
        <h1>Переосмысление инноваций</h1>
        <h2>Познакомьтесь с рабочим пространством для создания инноваций - платформой для совместной работы на основе ИИ, которая поможет ващей команде выполнять задачи быстрее.</h2>
        <h3>Далее идёт ознакомление описание всякая залупа</h3>
      </div>
      
    </>
  )
}
export default Home