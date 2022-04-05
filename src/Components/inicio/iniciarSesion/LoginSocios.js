import React, {useState, useContext} from "react";
import {
  Container,
  Button,
  Input,
  InputGroup,
  Col,
  Row,
  Spinner
} from "reactstrap";
import { FaUser, FaEye, FaEyeSlash } from "react-icons/fa";
import Menu from '../menuInicio/MenuInicio'
import swal from "sweetalert";
import { Link, useNavigate } from 'react-router-dom'
import UsuarioSocioContext from "../../Socios/context/UsuarioSocioContext";
// FIRESTORE
import { auth, db } from "../../../firebase-config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";


function LoginSocios() {
  
  const { setSocioLoggeado } = useContext(UsuarioSocioContext)
  const [email, setEmail] = useState("")
  const [contrasena, setContrasena] = useState("")
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  

  const submitHandler = async () => {
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
          telefono: response?.telefono,
          rol: response?.rol,
          sesion: "socio",
          zona: response?.zona,
          codigo_postal: response?.codigo_postal,
          colonias: response?.colonias,
          ciudad: response?.ciudad,
          estado: response?.estado,
          pais: response?.pais,
          productos: response?.productos,
          clientes: response?.clientes,
          facturacion_socio: response?.facturacion_socio,
          calificacion: response?.calificacion,
          pedidos: response?.pedidos,
          validado: response?.validado,
          activo: response?.activo,
        }
        
        if (response.rol.filter(x => x === "socio").length >= 1){
          // const productos = [response?.productos.map(p => [{p, precio_de_compra: "asdf"}])]
          localStorage.setItem('infoUsuarioSocio', JSON.stringify(infoUsuario))
          localStorage.setItem('productosSocio', JSON.stringify(response?.productos))
          setSocioLoggeado(true)
          window.location.reload()
          navigate('/socios')
        } else { 

          swal({
            title: "Error",
            text: "Usuario no registrado como socio. Intente nuevamente.",
            icon: "error",
            button: "Cerrar"
          });
      }
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
      // obtener referencia a coleccion
        const refUsuarios = doc(db, "usuarios", auth.currentUser.uid)
        // getDoc me obtiene el documento pasandole la referencia al documento
        const dataU = await getDoc(refUsuarios)
        // .data() me convierte la data en un json que puedo trabajar en el front
        // setDataUsuario2(dataU.data())
        res(dataU.data())
    //  ------------------------------------------------------------------------------    
    })
  }


  return (
    <React.Fragment>
        <Menu hrefLogo="/" chico soloVolver color="fondoNegro" blanco />
        <div className="centro pabenorme fondoBlanco">
            <Container className="pabenorme parmediano">
                <div className='parmuygrande pizmediano pdemediano'>
                  <div className="pabmediano">
                    <FaUser className="rojo tmuygrande centradoIconoSocios" /> <span className="rojo tenorme wbold">SOCIOS</span>
                    <div className="tchica wbold parmuygrande">Iniciar sesión</div>
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
                      <Button onClick={submitHandler} className="botonRojo w100">
                        {loading ? <Spinner size="sm" className='tSpinnerBoton' /> : "Iniciar Sesión"}
                      </Button>
                    </Col>
                    <Col xs={12} className="centro parmuychico linkAzul">
                      <Link to="/recuperar-contrasena">¿Olvidaste tu contraseña?</Link>
                    </Col>
                  </Row>   
                </div>
                <div className="parenorme">
                  <div className="wbold parenorme centro"><Link to="/registro-socio" className="botonTransparente rojo linkSF">¡Regístrate aquí!</Link></div>
                </div>
            </Container>
        </div>

    </React.Fragment>
  );
}

export default LoginSocios;