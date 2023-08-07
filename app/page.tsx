import Image from 'next/image'
import styles from './page.module.css'
import { ButtonImage } from './components/ButtonImage'
import insemp from './img/Inscribeem.png'
import { LoginComponent } from './components/login/LoginComponent'

export default function Home() {
  return (
    <div className="bgads">
      <div className="row">
        <div className='col-md-6'>
          <ButtonImage url='/adscripcion' text='Inscribe Entidad Empleadora' img={insemp.src} />
        </div>
        <div className='col-md-6'>



          {/* <ButtonImage url='/tramitacion' text='Ingreso al portal' img={redcross.src} /> */}

          <LoginComponent buttonText='Ingresar' />
        </div>
      </div>
    </div>
  )
}
