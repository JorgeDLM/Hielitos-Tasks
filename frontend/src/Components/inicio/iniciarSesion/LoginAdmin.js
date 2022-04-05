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
import axios from  'axios'
import { useNavigate } from 'react-router-dom'
import UsuarioAdminContext from "../../Admin/context/UsuarioAdminContext";


function LoginAdmin() {
  
  const { setAdminLoggeado, editarUsuarioAdmin } = useContext(UsuarioAdminContext)
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
      const config = {
        headers: {
          "Content-type": "application/json"
        }
      }
        const { data } = await axios.post(
          "/api/usuarios-admin/login", 
          { email, contrasena }, 
          config
        )
        const dataUsuario = localStorage.setItem('infoUsuarioAdmin', JSON.stringify(data))
        editarUsuarioAdmin(dataUsuario)
        setLoading(false)
        setAdminLoggeado(true)
        navigate('/admin')
      } catch (error){
        swal({
          title: "Error",
          text: "Usuario o contraseña invalida, intente nuevamente.",
          icon: "error",
          button: "Cerrar"
        });
        setLoading(false);
    }
  }




  return (
    <React.Fragment>
        <Menu hrefLogo="/" chico soloVolver color="fondoNegro" blanco />
        <div className="centro pabenorme fondoBlanco">
            <Container className="pabenorme parmediano">
                <div className='parmuygrande pizmediano pdemediano'>
                  <div className="pabmediano">
                    <FaUser className="negro tmuygrande centradoIconoSocios" /> <span className="negro tenorme wbold">ADMIN</span>
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
                      <Button onClick={submitHandler} className="botonNegro w100">
                        {loading ? <Spinner size="sm" className='tSpinnerBoton' /> : "Iniciar Sesión"}
                      </Button>
                    </Col>
                    <Col xs={12} className="centro parmuychico linkAzul">
                      <a href="/recuperar-contrasena">¿Olvidaste tu contraseña?</a>
                    </Col>
                  </Row>   
                </div>
            </Container>
        </div>

    </React.Fragment>
  );
}

export default LoginAdmin;