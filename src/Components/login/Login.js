import React, {useState, useContext} from "react";
import swal from "sweetalert";
import { useNavigate } from 'react-router-dom'
import { InputGroup, Input, Button, Row, Col, Spinner } from 'reactstrap'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import UsuarioContext from "../Admin/context/UsuarioContext";
// FIRESTORE
import { auth, db } from "../../firebase-config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const Login = () => {
  
  const [email, setEmail] = useState("")
  const [contrasena, setContrasena] = useState("")
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { setUsuarioLoggeado, setUsuario } = useContext(UsuarioContext)

    
  const login = async () => {
    setLoading(true);
    if(email === "" || contrasena === ""){
      swal({
        title: "Error",
        text: "Favor de validar todos los campos.",
        icon: "warning",
        button: "Cerrar"
      });
      setLoading(false);
      return;
    }
    try {
        
      await signInWithEmailAndPassword(
          auth,
          email,
          contrasena
        )

        let response = await promesaData()

        const infoUsuario = {
          id: auth.currentUser.uid,
          email: auth.currentUser.email,
          nombre: response?.nombre,
          apellidos: response?.apellidos,
          rol: response?.rol,
          activo: response?.activo,
        }

        const dataUsuario = localStorage.setItem('infoUsuario', JSON.stringify(infoUsuario))
        setUsuarioLoggeado(true)
        await setUsuario(dataUsuario)
        window.location.reload()
        navigate('/admin')
        setLoading(false)
        

      } catch (error){
        swal({
          title: "Error",
          text: error.message === "Firebase: Error (auth/email-already-in-use)." ? "Ese usuario ya existe." : 
            error.message === "Firebase: Error (auth/user-not-found)." ? "Usuario o contraseña incorrecta, intente nuevamente." : 
            error.message === "Firebase: Error (auth/wrong-password)." ? "Contraseña incorrecta." : 
            error.message === "Firebase: Error (auth/network-request-failed)." ? "Valide su conexión a internet." : 
            error.message === "Firebase: Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later. (auth/too-many-requests)." ? "Usuario bloqueado temporalmente por demasiados intentos de loggeo. Intentalo más tarde." : 
            error.message,
          icon: "error",
          button: "Cerrar"
        });
        setLoading(false);
      }
  }


  const promesaData = async () => {
    return new Promise(async (res, rej) => {  
    //  FIREBASE----------------------------------------------------------------------   
        const refUsuarios = doc(db, "usuarios", auth.currentUser.uid)
        const dataU = await getDoc(refUsuarios)
        res(dataU.data())
    //  ------------------------------------------------------------------------------    
    })
  }

  return (
    <>
      <div className='parmuygrande pizmediano pdemediano'>
        <div className="pabmediano">
          <div className="tchica wbold parmuygrande azul">Iniciar sesión</div>
        </div>
        <Input
          name="email"
          type="text"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
        />
        <InputGroup>
          <Input
            name="contrasena"
            type={visible ? "text" : "password"}
            value={contrasena}
            onChange={e => setContrasena(e.target.value)}
            placeholder="Contraseña"
          />
          <Button className='botonContrasena' onClick={() => setVisible(!visible)}>{visible ? <FaEyeSlash /> : <FaEye />}</Button>
        </InputGroup>
        <Row className="parchico">
          <Col className="centro" xs={{ size: 12 }}>
            <Button onClick={login} className="botonAzul w100">
              {loading ? <Spinner size="sm" className='tSpinnerBoton' /> : "Iniciar Sesión"}
            </Button>
          </Col>
        </Row>   
      </div>
    </>
  )
}

export default Login