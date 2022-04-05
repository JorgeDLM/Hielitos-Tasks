import React, {useState, useContext, useEffect} from "react";
import {
  Container,
  Col,
  Row,
  Input,
  FormGroup,
  FormFeedback,
  Card,
  Button,
  Label,
  Spinner,
  InputGroup
} from 'reactstrap';
import Camioneta from "../../../../../imgs/camioneta5.png"
import { FaEye, FaEyeSlash, FaCheck, FaWhatsapp } from 'react-icons/fa'
import swal from "sweetalert";
import { useNavigate } from 'react-router-dom'
import Menu from '../../../menuInicio/MenuInicio'
import UsuarioSocioContext from "../../../../Socios/context/UsuarioSocioContext";
import { collection, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../../../../firebase-config";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import codigos_postales from '../../codigo_postal.json'




function RegistroSocio() {

    const { setSocioLoggeado } = useContext(UsuarioSocioContext)

    const [visible, setVisible] = useState(false)
    const [nombre, setNombre] = useState("")
    const [apellidos, setApellidos] = useState("")
    const [email, setEmail] = useState("")
    const [contrasena, setContrasena] = useState("")
    const [contrasena2, setContrasena2] = useState("")
    const [telefono, setTelefono] = useState("")
    const [codigo_postal, setCodigo_postal] = useState("")
    const [terminos, setTerminos] = useState(false)
    const [loading, setLoading] = useState(false)
    const [contacto, setContacto] = useState([])
    const [loadingContacto, setLoadingContacto] = useState(true)
    const [dataCP, setDataCP] = useState([])
    const [zona, setZona] = useState([])
    const navigate = useNavigate()
  
  

	
    const nombreValido = nombre !== ""
    const apellidosValidos = apellidos !== ""
    const emailValido = email !== "" && email.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
    const telefonoValido = telefono  !== "" && telefono.length === 10
    const contrasenaValida = contrasena !== "" && contrasena.length >= 6 && contrasena2  !== "" && contrasena === contrasena2
    const codigoPostalValido = codigo_postal !== '' && codigo_postal.length === 5 && zona.estado

    
    const dataCompleta = (
      nombreValido &&
      apellidosValidos && 
      emailValido &&
      telefonoValido &&
      contrasenaValida &&
      codigoPostalValido && 
      terminos !== false
      )

      const fetchContacto = async() => {
        const contactoRef = collection(db, "contacto")
        const dataContacto =  await getDocs(contactoRef)
        const getDataContacto = dataContacto.docs.map((doc) => ({...doc.data()}))      
        setContacto(getDataContacto.filter(c => c.nombre === "Contacto"))
        setLoadingContacto(false)
    }

    useEffect(() => {
        fetchContacto();
    }, [])
    
    useEffect(() => {
          
      const fetchCodigoPostal = async() => {
          setDataCP(codigos_postales)
      }
      fetchCodigoPostal();
    }, [])
  
    const agregarCP = () => {
      if (codigo_postal.length === 5){
        const estado = dataCP.filter(cp => cp.codigo_postal === codigo_postal)[0]?.estado
        const ciudad = dataCP.filter(cp => cp.codigo_postal === codigo_postal)[0]?.ciudad
        const zonaDeVenta = dataCP.filter(cp => cp.codigo_postal === codigo_postal)[0]?.zona
        const colonias = dataCP.filter(cp => cp.codigo_postal === codigo_postal)?.map(cp => cp.colonia)
        const zona = {estado, ciudad, colonias, zonaDeVenta}
        setZona(zona)
      }
    }

  
    const submitHandler = async () => {
      setLoading(true);
      if(!dataCompleta){
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

        const dataUsuario = {
          nombre: nombre, 
          email: email,
          apellidos: apellidos, 
          telefono: telefono, 
          rol: ["socio"],
          sesion: "socio",
          zona: zona?.zonaDeVenta,
          codigo_postal: codigo_postal, 
          colonias: zona?.colonias, 
          ciudad: zona?.ciudad, 
          estado: zona?.estado, 
          pais: "México",  
          productos: [],
          clientes: [],
          calificacion: 5,
          pedidos: [],
          validado: false,
          activo: true
        }    

        await createUserWithEmailAndPassword(auth, email, contrasena)
  
        const crearUsuarioFirebase = async () => {
          await setDoc(doc(db, "usuarios", auth.currentUser.uid), dataUsuario)
        }
        crearUsuarioFirebase()
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
          calificacion: response?.calificacion,
          pedidos: response?.pedidos,
          validado: response?.validado,
          activo: response?.activo,
        }

          swal({
            title: "Registro exitoso",
            text: "¡Bienvenido! Será un gusto hacer equipo contigo.",
            icon: "success",
            button: "Cerrar"
          });

          localStorage.setItem('infoUsuarioSocio', JSON.stringify(infoUsuario));
          localStorage.setItem('productosSocio', JSON.stringify(response?.productos))
          setLoading(false);
          setSocioLoggeado(true)
          window.location.reload()
          navigate('/socios')
        } catch (error){

  // USUARIO EXISTENTE ----------------------------------------------------------------
          if (error.message === "Firebase: Error (auth/email-already-in-use)."){  
            try{
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

      // AGREGAR ROL DE SOCIO -----------------------------------------------
            if (response.rol.filter(x => x === "socio").length === 0) {
              response.rol.push('socio')
              await updateDoc(doc(db, "usuarios", auth.currentUser.uid), {rol: response.rol, validado: false})

              const updateUser = async () => {
                  
                  
                  swal({
                    title: "Registro exitoso",
                    text: "¡Bienvenido! Será un gusto hacer equipo contigo.",
                    icon: "success",
                    button: "Cerrar"
                  });
                  localStorage.setItem('infoUsuarioSocio', JSON.stringify(infoUsuario));
                  localStorage.setItem('productosSocio', JSON.stringify(response?.productos))
                  setLoading(false);
                  setSocioLoggeado(true)
                  window.location.reload()
                  navigate('/socios')
              }
  
              updateUser()
            }
      // --------------------------------------------------------------------

      // LOGEAR SOCIO YA REGISTRADO -----------------------------------------
            if (response.rol.filter(x => x === "socio").length >= 1) {
              console.log(response)
              localStorage.setItem('infoUsuarioSocio', JSON.stringify(infoUsuario));
              localStorage.setItem('productosSocio', JSON.stringify(response?.productos))
              setLoading(false);
              setSocioLoggeado(true)
              window.location.reload()
              navigate('/socios')
            }
      // --------------------------------------------------------------------

          } catch (error) {
            // USUARIO EXISTENTE CONTRASEÑA ERRONEA
                swal({
                  title: "Error",
                  text: error.message === "Firebase: Error (auth/wrong-password)." ? "Este usuario ya esta registrado como cliente, ingrese la misma contraseña." : error.message,
                  icon: "error",
                  button: "Cerrar"
                });
          }
          } else {
            swal({
              title: "Error inesperado",
              text:
                error.message === "Firebase: Error (auth/email-already-in-use)." ? "Ese usuario ya existe." : 
                error.message === "Firebase: Error (auth/user-not-found)." ? "Usuario o contraseña incorrecta, intente nuevamente." : 
                error.message === "Firebase: Error (auth/wrong-password)." ? "Este usuario ya esta registrado como cliente, ingrese la misma contraseña." : 
                error.message === "Firebase: Error (auth/network-request-failed)." ? "Valide su conexión a internet." : 
                error.message === "Firebase: Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later. (auth/too-many-requests)." ? "Usuario bloqueado temporalmente por demasiados intentos de loggeo. Intentalo más tarde." : 
                error.message,
              icon: "error",
              button: "Cerrar"
            });
          }
    //  -------------------------------------------------------------------------------
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

    const contactoGris = contacto?.map((c, i) => (c.nombre === "Contacto" && <div key={i} className="parchico linkGris"><a href={`https://api.whatsapp.com/send?text=Hola, los contacto por Mercado a la Mano con respecto a &phone=+52${c.telefono}`}><FaWhatsapp className="verde tIconos"/><span className="pizchico">+52 {c.telefono.replace(/\D*(\d{3})\D*(\d{3})\D*(\d{4})\D*/, '$1 $2 $3')}</span></a></div>))
    const contactoNegro = contacto?.map((c, i) => (c.nombre === "Contacto" && <div key={i} className="parchico linkNegro wbold d-inline"><a href={`https://api.whatsapp.com/send?text=Hola, los contacto por Mercado a la Mano con respecto a &phone=+52${c.telefono}`}><FaWhatsapp className="verde tIconos"/><span className="pizmuychico">{c.telefono.replace(/\D*(\d{3})\D*(\d{3})\D*(\d{4})\D*/, '$1 $2 $3')}</span></a></div>))


  return (
    <React.Fragment>
        <Menu hrefLogo="/" chico soloVolver className="fondoBlanco" blanco />
        <div className="pabmuygrande noselect">
            <Container>
                <div className='parmuygrande pizmediano pdemediano'>
                    <Card>
                        <div className=''>
                        <Row>
                            <Col xs={12} md={6} className="penorme pizmuygrande pdemuygrande">
                                <div className='centro wbold pabgrande'>CREA UNA CUENTA</div>
                                
                                {/* NOMBRE */}
                                <div>Nombre(s):</div>
                                <Input name="nombre" type="text" value={nombre} placeholder="Nombre(s)" onChange={e => setNombre(e.target.value)} />
                                
                                {/* APELLIDOS */}
                                <div className='parmediano'>Apellido(s):</div>
                                <Input name="apellidos" type="text" value={apellidos} placeholder="Apellido(s)" onChange={e => setApellidos(e.target.value)} />
                                
                                {/* EMAIL */}
                                <div className='parmediano'>Correo eletrónico:</div>
                                <InputGroup>
                                <Input name="email" type="email" value={email} placeholder="Correo eletrónico" onChange={e => setEmail(e.target.value.toLowerCase())} 
                                    invalid={email !== "" && !email.toLowerCase().match(
                                        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                                    )} 
                                />
                                <FormFeedback>Ingrese un correo eletrónico valido.</FormFeedback>
                                </InputGroup>
                            
                                {/* CONTRASENA */}
                                <div className='parmediano'>Contraseña:</div>
                                <InputGroup>
                                <Input name="contrasena" type={visible ? "text" : "password"} value={contrasena} placeholder="Contraseña" onChange={e => setContrasena(e.target.value)} 
                                    invalid={contrasena !== '' && contrasena.length < 6}
                                />
                                <Button className='botonContrasena' onClick={() => setVisible(!visible)}>{visible ? <FaEyeSlash /> : <FaEye />}</Button>
                                <FormFeedback>Su contraseña debe tener por lo menos 6 caracteres.</FormFeedback>
                                </InputGroup>
                            
                                {/* CONTRASENA2 */}
                                <div className='parmediano'>Valide su contraseña:</div>
                                <InputGroup>
                                <Input name="contrasena2" type={visible ? "text" : "password"} value={contrasena2} placeholder="Valide su contraseña" onChange={e => setContrasena2(e.target.value)} 
                                    invalid={contrasena2 !== "" && (contrasena !== contrasena2)}
                                />
                                <Button className='botonContrasena' onClick={() => setVisible(!visible)}>{visible ? <FaEyeSlash /> : <FaEye />}</Button>
                                <FormFeedback>Su contraseña no coincide.</FormFeedback>
                                </InputGroup>
                                
                                {/* TELEFONO */}
                                <div className='parmediano'>Teléfono:</div>
                                <InputGroup>
                                <Input name="telefono" type="tel" value={telefono} maxLength={10} placeholder="Teléfono" onChange={e => setTelefono(e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1'))} 
                                    invalid={telefono !== '' && telefono.length < 10}
                                />
                                <FormFeedback>Ingrese un número de 10 digitos valido.</FormFeedback>
                                </InputGroup>

                                {/* CODIGO POSTAL */}
                                <div className='parmediano'>Código postal:</div>
                                <Input 
                                name="codigo_postal" type="text" value={codigo_postal} placeholder="Código postal" maxLength={5}
                                onBlur={() => {agregarCP()}}
                                onChange={e => {setCodigo_postal(e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1'))}}
                                invalid={(codigo_postal !== '' && codigo_postal.length < 5) || !zona.estado}
                                valid={codigo_postal.length === 5}/>
                                <FormFeedback>{codigo_postal.length === 5 ? 
                                  `Aún no repartimos en este código postal, si te interesa distribuir en tu ciudad contáctanos! Teléfono: ${contacto?.map(c => (c.nombre === "Contacto" && c.telefono))}.` 
                                  : "Ingrese un código postal valido"}
                                </FormFeedback>
                                
                                {/* TODO: IFE */}
                                {/* <div className="pmediano wbold">Documento Ife frente - Ife reverso</div> */}
                                
                            
                                {/* TERMINOS Y CONDICIONES */}
                                <FormGroup className='pargrande'>
                                <Row>
                                    <Col xs={1} md={2} lg={1}>
                                    <Input name="terminos_y_condiciones" type="checkbox" onClick={() => setTerminos(!terminos)} />
                                    </Col>
                                    <Col className='sinpymiz'>
                                    <Label>Acepto los <a className='linkSF' href="/terminos-y-condiciones">términos y condiciones</a> y <a className='linkSF' href="/terminos-y-condiciones">avisos de privacidad</a>.</Label>
                                    </Col>
                                </Row>
                                </FormGroup>
                                <div className='parchico'>
                                <Button onClick={() => submitHandler()} disabled={!dataCompleta} className="botonNegro w100">{loading ? <Spinner size="sm" className='tSpinnerBoton' /> : "Continuar"}</Button>
                                </div>
                            </Col>
                            <Col className='d-none d-md-block'>
                            <div className="wbold tmediana parenorme pabmediano">Beneficios de los socios:</div>
                            <div className="gris izquierda pizenorme"><FaCheck className="verde"/> Buscamos clientes para tí</div>
                            <div className="gris izquierda pizenorme"><FaCheck className="verde"/> Aumentamos tus ventas</div>
                            <div className="gris izquierda pizenorme"><FaCheck className="verde"/> Te generamos ordenes de compra conjuntas</div>
                            <div className="gris izquierda pizenorme"><FaCheck className="verde"/> Facilitamos la cobranza</div>
                            <div className="gris izquierda pizenorme"><FaCheck className="verde"/> Te ayudamos con tus compras y estandarizamos precios</div>
                            <div className="gris izquierda pizenorme"><FaCheck className="verde"/> Te ahorramos salarios y tiempo</div>
                            <div className="gris izquierda pizenorme"><FaCheck className="verde"/> Y mucho más, para más información contáctanos: 
                            {' '}{loadingContacto ? <Spinner className="gris" size="sm" /> : contactoNegro}
                                <img src={Camioneta} alt="" className='tamanoCamioneta parenorme' />
                            </div>
                            <div className='centro parenorme'>
                                <div className="wbold tchica pabmuychico">¿Ya estás registrado?</div>
                                    <Button href="login-socios" className="botonRojo">Iniciar sesión</Button>
                            </div>
                            </Col>
                        </Row>
                        </div>
                    </Card>
                    <Row className='parenorme'>
                        <Col xs={{size:10, offset:1}} md={{size:4, offset:1}}  xl={{size:4, offset:2}} className="centro pargrande pabgrande">
                        <div className="wbold">¿Eres cliente?</div>
                        <div className="parchico linkAzul"><Button className="botonTransparente" href="/registro-cliente">¡Registrate aquí!</Button></div>
                        </Col>
                        <Col xs={{size:10, offset:1}} md={4}  xl={4} className="centro pargrande pabgrande">
                        <div className="wbold">Necesitas ayuda?</div>
                            {loadingContacto ? <Spinner className="gris" size="sm" /> : contactoGris}
                        </Col>
                    </Row>
                </div>
            </Container>
        </div>

    </React.Fragment>
  );
}

export default RegistroSocio;