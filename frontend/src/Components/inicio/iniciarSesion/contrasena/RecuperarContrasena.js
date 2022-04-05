import React, { useContext, useState } from 'react';
import { Row, Col, Input, Button } from 'reactstrap';
import Menu from '../../menuInicio/MenuInicio'
import { auth } from '../../../../firebase-config';
import { sendPasswordResetEmail } from 'firebase/auth';
import UsuarioClienteContext from '../../../Clientes/context/UsuarioClienteContext';
import swal from 'sweetalert';
import { useNavigate } from 'react-router-dom'

function RecuperarContrasena() {

    const { usuario }= useContext(UsuarioClienteContext)

// TODO: Hacer recuperar contraseña
const [email, setEmail] = useState(usuario ? usuario.email : "")    

const navigate = useNavigate()

const links = [
    {id:"inicio", nombre:"Inicio", href:"inicio"},
    {id:"tu-mejor-opcion", nombre:"Tu Mejor Opción", href:"tu-mejor-opcion"},
    {id:"quienes-somos", nombre:"Quiénes Somos", href:"quienes-somos"},
    {id:"preguntas-frecuentes", nombre:"Preguntas Frecuentes", href:"preguntas-frecuentes"},
    {id:"contacto", nombre:"Contacto", href:"contacto"},
]

const recuperarContrasena = async () => {
    try {
        await sendPasswordResetEmail(auth, email)
        
        swal({
            title: "Listo",
            text: "Un correo electrónico ha sido enviado para resetear su contraseña.",
            icon: "success",
            button: "Cerrar"
          });
          navigate('/')
    }
    catch (error) {
        swal({
            title: "Error",
            text: error.message === "Firebase: Error (auth/user-not-found)." ? "Usuario no registrado, valide su correo electrónico." : error.message,
            icon: "error",
            button: "Cerrar"
          });
    }
}

const validEmail = email.toLowerCase().match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
)


return (
    <React.Fragment>
        <Menu links={links} hrefLogo="/" chico color="fondoNegro" negro />
{/* TODO: Hacer Mutaciones y hacer que funcione */}
        <React.Fragment>
            <Menu className="fondoBlanco" chico blanco />{" "}
            <div className="centro parenorme wbold">¿Olvidaste tu contraseña?</div>
            <Row className="parmuychico pabmuychico">
                <Col
                    xs={{ size: 10, offset: 1 }}
                    sm={{ size: 6, offset: 3 }}
                    md={{ size: 4, offset: 4 }}
                >
                    <Input name="email" type="email" value={email} placeholder="Ingrese su correo electrónico" onChange={e => setEmail(e.target.value.toLowerCase())} 
                                invalid={email !== "" && !validEmail} 
                    />
                </Col>
            </Row>
            <div className="centro pabenorme">
                <Button
                    className="botonAzul"
                    disabled={!validEmail}
                    onClick={() => {recuperarContrasena()}}>
                    Enviar
                </Button>
            </div>
        </React.Fragment>
    </React.Fragment>
    );
}

 
export default RecuperarContrasena;