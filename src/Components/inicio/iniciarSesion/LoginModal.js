import React, {useState, useContext} from "react";
import {
  Button,
  Modal,
  ModalBody,
  Input,
  InputGroup,
  Col,
  Row,
  Spinner,
} from "reactstrap";
import { FaUser, FaEye, FaEyeSlash } from "react-icons/fa";
import swal from "sweetalert";
import { Link, useNavigate } from 'react-router-dom'
import UsuarioClienteContext from "../../Clientes/context/UsuarioClienteContext";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../../firebase-config";
import { doc, getDoc } from "firebase/firestore";

function IniciarSesionModal(props) {

  const { setClienteLoggeado, editarUsuario } = useContext(UsuarioClienteContext)
  const [modal, setModal] = useState(false)
  const [email, setEmail] = useState("")
  const [contrasena, setContrasena] = useState("")
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  
  
  const registroInicial = props.registro
  const registro = props.registro
  const [esRegistro, setRegistro] = useState(registro)


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
          tipo: response?.tipo,
          rol: response?.rol,
          sesion: "cliente",
          zona: response?.zona,
          codigo_postal: response?.codigo_postal,
          ciudad: response?.ciudad,
          estado: response?.estado,
          colonias: response?.colonias,
          pais: response?.pais,
          nombre_negocio: response?.nombre_negocio, 
          telefono_negocio: response?.telefono_negocio,
          lugares_de_entrega: response?.lugares_de_entrega,
          facturacion_cliente: response?.facturacion_cliente,
          productos_favoritos: response?.productos_favoritos,
          socio_asignado: response?.socio_asignado,
          pedidos: response?.pedidos,
          cliente_preferencial: response?.cliente_preferencial,
          activo: response?.activo,
        }

        if (response.rol.filter(x => x === "cliente").length >= 1){
        const dataUsuario = localStorage.setItem('infoUsuarioCliente', JSON.stringify(infoUsuario))
        setClienteLoggeado(true)
        await editarUsuario(dataUsuario)
        window.location.reload()
        navigate('/clientes')
      } else { 
        
      swal({
          title: "Error",
          text: "Usuario no registrado como cliente. Intente nuevamente.",
          icon: "error",
          button: "Cerrar"
        });
      }
      setLoading(false)

      } catch (error){
        swal({
          title: "Error",
          text: error.message === "Firebase: Error (auth/wrong-password)." ? "Contraseña incorrecta. Intente nuevamente."
            : error.message === "Firebase: Error (auth/user-not-found)." ? "Usuario o contraseña invalida, intente nuevamente." 
            : error.message === "Firebase: Error (auth/network-request-failed)." ? "Valide su conexión a internet."
            : error.message,
          icon: "error",
          button: "Cerrar"
        });
        setLoading(false);
    }
  }

  const promesaData = async () => {
    return new Promise(async (res, rej) => {  
        const refUsuarios = doc(db, "usuarios", auth.currentUser.uid)
        const dataU = await getDoc(refUsuarios)
        res(dataU.data())
    //  ------------------------------------------------------------------------------    
    })
  }


  return (
    <React.Fragment>
      {props.otro && (
        <div onClick={() => {setModal(!modal); setRegistro(registroInicial)}}>{props.children}</div>
      )}
      {!props.otro && (
        <FaUser onClick={() => {setModal(!modal); setRegistro(registroInicial)}} className="navHighlight" />
      )}
      <Modal
        isOpen={modal}
        toggle={() => {setModal(!modal); setRegistro(registroInicial)}}
        className={[props.className, "noselect"]}
      >
        {!esRegistro ? 
        <>
          <div className="derecha pdechico parmuychico">
            <Button href="/login-socios" className="rojo botonIniciarSesion">Socios</Button>
          </div>
          <div className="negro wbolder centro pabgrande">
            <FaUser className="tenorme" />
          </div>
          <ModalBody>
            {/* {this.state.error && (
              <Alert color="danger">
                Hubo un error con su usuario o contrase&ntilde;a
              </Alert>
            )} */}
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
                  <Button onClick={submitHandler} className="botonNegro2 w100">
                    {loading ? <Spinner size="sm" className='tSpinnerBoton' /> : "Iniciar Sesión"}
                  </Button>
                </Col>
                <Col xs={12} className="centro parmuychico linkAzul">
                  <a href="/recuperar-contrasena">¿Olvidaste tu contraseña?</a>
                </Col>
              </Row>
          </ModalBody>
          <Row className="pizmediano pdemediano pabmediano">
            <Col onClick={() => setRegistro(!esRegistro)} xs={7} sm={8} className="centro parchico negro letraIniciar">
                ¿Aún no eres usuario?{" "}
                <div className="d-inline wbolder">Registrate Aquí</div>
            </Col>
            <Col className="derecha parmuychico pdegrande" xs={5} sm={4}>
              <Button className="botonRojo letraIniciar" onClick={() => {setModal(false); setRegistro(registroInicial)}}>
                Cancelar
              </Button>
            </Col>
          </Row>
        </>
        :
        <>
          <ModalBody>
              <div className="centro pabgrande">
              <div className="wbold pabchico tgrande">¿Qué deseas?</div>
              <hr />
                <div className="pargrande">
                <Row>
                  <Col>
                    <div className="contenedorDerecha">
                      <div className="botonComprarImagen">
                        <Link to="registro-cliente">
                          <Button className="botonComprar">
                            COMPRAR
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Col>
                  <Col>
                    <div className="contenedorIzquierda">
                      <div className="botonVenderImagen">
                        <Link to="registro-socio">
                          <Button className="botonVender" outline>
                            VENDER
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Col>
                </Row>
                </div>
              </div>
            <div className="centro">
              <Button onClick={() => setRegistro(!esRegistro)} className="botonLogin"><span className="wbold">¿Ya estás registrado?</span> Da click aquí</Button>
            </div>
            </ModalBody>
          <div className="pabchico pdechico centro">
              <Button className="botonRojo" onClick={() => {setModal(false); setRegistro(registroInicial)}}>
                Cancelar
              </Button>
          </div>
        </>
        }
      </Modal>
    </React.Fragment>
  );
}

export default IniciarSesionModal;