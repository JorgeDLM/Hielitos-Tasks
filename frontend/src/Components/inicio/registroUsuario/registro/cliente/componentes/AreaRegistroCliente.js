import React, { useState, useContext, useEffect } from 'react';
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
import Granjero from '../../../../../../imgs/Granjero.png'
import { FaEye, FaEyeSlash, FaWhatsapp } from 'react-icons/fa'
import IniciarSesionModal from '../../../../iniciarSesion/LoginModal';
import swal from "sweetalert";
import { useNavigate } from 'react-router-dom'
import UsuarioClienteContext from "../../../../../Clientes/context/UsuarioClienteContext";
import codigos_postales from '../../../codigo_postal.json'


// FIREBASE
import { db, auth } from '../../../../../../firebase-config'
import { doc, setDoc, collection, getDocs, getDoc, updateDoc} from 'firebase/firestore'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'


function AreaRegistroCliente() {

  const { setClienteLoggeado } = useContext(UsuarioClienteContext)

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
      const zona = zonaDeVenta !== undefined ? {estado, ciudad, colonias, zonaDeVenta} : {estado, ciudad, colonias}
      setZona(zona)
    }
  }


  const validacion = (
    nombre !== "" &&
    apellidos !== "" && 
    email !== "" && email.toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    ) &&
    contrasena !== "" && contrasena.length >= 6  &&
    contrasena2  !== "" && contrasena === contrasena2 &&
    telefono  !== "" && telefono.length === 10 &&
    (codigo_postal !== '' && codigo_postal.length === 5 && zona.estado) && 
    terminos !== false
  )


  const submitHandler = async () => {
    setLoading(true);
    if(!validacion){
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
        tipo: "Casa",
        rol: ["cliente"],
        sesion: "cliente",
        zona: zona?.zonaDeVenta,
        codigo_postal: codigo_postal, 
        colonias: zona?.colonias, 
        ciudad: zona?.ciudad, 
        estado: zona?.estado, 
        pais: "México", 
        pedidos: [],
        productos_favoritos: [],
        cliente_preferencial: false,
        activo: true,
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
          tipo: response?.tipo,
          rol: response?.rol,
          sesion: "cliente",
          zona: response?.zona,
          codigo_postal: response?.codigo_postal, 
          colonias: response?.colonias,
          ciudad: response?.ciudad,
          estado: response?.estado,
          pais: response?.pais,
          pedidos: response?.pedidos,
          productos_favoritos: response?.productos_favoritos,
          cliente_preferencial: response?.cliente_preferencial,
          activo: response?.activo,
        }
        
        swal({
          title: "Registro exitoso",
          text: "¡Bienvenid@! Será un gusto atenderte.",
          icon: "success",
          button: "Cerrar"
        });
        
        localStorage.setItem('infoUsuarioCliente', JSON.stringify(infoUsuario));
        setLoading(false);
        setClienteLoggeado(true)
        window.location.reload()
        navigate('/clientes')
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
    
        // AGREGAR ROL DE CLIENTE -----------------------------------------------
              if (response.rol.filter(x => x === "cliente").length === 0) {
                response.rol.push('cliente')
                await updateDoc(doc(db, "usuarios", auth.currentUser.uid), {rol: response.rol})
  
                const updateUser = async () => {
                          
                    swal({
                      title: "Registro exitoso",
                      text: "¡Bienvenid@! Será un gusto atenderte.",
                      icon: "success",
                      button: "Cerrar"
                    });
                    localStorage.setItem('infoUsuarioCliente', JSON.stringify(infoUsuario));
                    setLoading(false);
                    setClienteLoggeado(true)
                    window.location.reload()
                    navigate('/clientes')
                }
    
                updateUser()
              }
        // --------------------------------------------------------------------
  
        // LOGEAR CLIENTE YA REGISTRADO -----------------------------------------
              if (response.rol.filter(x => x === "cliente").length >= 1) {
                localStorage.setItem('infoUsuarioCliente', JSON.stringify(infoUsuario));
                setLoading(false);
                setClienteLoggeado(true)
                window.location.reload()
                navigate('/clientes')
              }
        // --------------------------------------------------------------------
  
          } catch (error) {
            // USUARIO EXISTENTE CONTRASEÑA ERRONEA
                swal({
                  title: "Error",
                  text: error.message === "Firebase: Error (auth/wrong-password)." ? "Este contraseño ya esta registrado como socio, ingrese la misma contraseña." : error.message,
                  icon: "error",
                  button: "Cerrar"
                });
          }


          } else {
            swal({
              title: "Error",
              text: 
                error.message === "Firebase: Error (auth/email-already-in-use)." ? "Ese usuario ya existe." : 
                error.message === "Firebase: Error (auth/user-not-found)." ? "Usuario o contraseña incorrecta, intente nuevamente." : 
                error.message === "Firebase: Error (auth/wrong-password)." ? "Este usuario ya esta registrado como socio, ingrese la misma contraseña." : 
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


  const contactoGris = contacto?.map(c => (c.nombre === "Contacto" && <div className="parchico linkGris"><a href={`https://api.whatsapp.com/send?text=Hola, los contacto por Mercado a la Mano con respecto a &phone=+52${c.telefono}`}><FaWhatsapp className="verde tIconos"/><span className="pizchico">+52 {c.telefono.replace(/\D*(\d{3})\D*(\d{3})\D*(\d{4})\D*/, '$1 $2 $3')}</span></a></div>))

    return (
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
                      `Aún no repartimos en este código postal, si te interesa nuestro servicio para tu ciudad contáctanos! Teléfono: ${contacto?.map(c => (c.nombre === "Contacto" && c.telefono))}.` 
                      : "Ingrese un código postal valido"}
                    </FormFeedback>
                   
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
                      <Button onClick={() => submitHandler()} disabled={!validacion} className="botonNegro w100">{loading ? <Spinner size="sm" className='tSpinnerBoton' /> : "Continuar"}</Button>
                    </div>
                 </Col>
                 <Col className='d-none d-md-block'>
                   <div className='parenorme centro pdeenorme'>
                     <img src={Granjero} alt="" className='tamanoGranjero parenorme' />
                   </div>
                   <div className='centro parenorme'>
                     <div className="wbold tchica pabmuychico">¿Ya estás registrado?</div>
                     <IniciarSesionModal otro>
                        <Button className="botonAzul">Iniciar sesión</Button>
                     </IniciarSesionModal>
                   </div>
                 </Col>
               </Row>
            </div>
          </Card>
          <Row className='parenorme'>
            <Col xs={{size:10, offset:1}} md={{size:4, offset:1}}  xl={{size:4, offset:2}} className="centro pargrande pabgrande">
              <div className="wbold">¿Eres vendedor?</div>
              <div className="parchico linkRojo"><Button className='botonTransparente' href="/registro-socio">Registrate aquí</Button> y comienza a vender con nosotros, estaremos felices de sumarte al equipo!</div>
            </Col>
            <Col xs={{size:10, offset:1}} md={4}  xl={4} className="centro pargrande pabgrande">
              <div className="wbold">Necesitas ayuda?</div>
              {loadingContacto ? <Spinner className="gris" size="sm" /> : contactoGris}
            </Col>
          </Row>
        </div>
      </Container>
    );
}

export default AreaRegistroCliente;
