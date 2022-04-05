import React, { useState } from 'react';
import {
  Input,
  Row,
  Col,
  InputGroup,
  Button,
  Spinner,
  FormFeedback,
} from 'reactstrap';
import logo from '../../../../imgs/logoNegro.png';
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { confirmPasswordReset } from 'firebase/auth';
import { auth } from '../../../../firebase-config';
import swal from 'sweetalert';
import { useLocation, useNavigate } from 'react-router-dom';

function ConfirmarContrasena() {
  const [loading, setLoading] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const contrasenaValida = newPassword.length >= 6

  const url = useLocation()
  const params = new URLSearchParams(url.search)
  const oobCode = params.get("oobCode")
  const navigate = useNavigate()


  const setearContrasena = async() => {
    setLoading(true)
    try {
      await confirmPasswordReset(auth, oobCode, newPassword)

      swal({
        title: "Contraseña actualizada.",
        text: "",
        icon: "success",
        button: "Cerrar"
      });
      navigate('/')
      setLoading(false)
    } catch (error) {
      swal({
        title: "Error",
        text: error.message,
        icon: "warning",
        button: "Cerrar"
      });

      setLoading(false)
    }
  }

  return (
    <div className='noselect'>
        <div className="pabenorme centro">
          <img className="logoContrasena" src={logo} alt="" />
        </div>
        <div className="wbold centro">
          Ingrese una nueva contraseña.
        </div>
        <Row>
          <Col xs={{ size: 8, offset: 2 }}>
            <InputGroup className="mb-2 mt-2">
              <Input type={showPassword ? "text" : "password"} placeholder="Contraseña" value={newPassword} 
                onChange={e => setNewPassword(e.target.value)} 
                invalid={newPassword !== "" && !contrasenaValida}
              />
              <Button onClick={() => setShowPassword(!showPassword)} className="botonNegro2">
                {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
              </Button>
              <FormFeedback>Su contraseña debe contener al menos 6 caracteres.</FormFeedback>  
            </InputGroup>
           <div className='centro pabenorme'>
              <Button
                onClick={() => {setearContrasena()}}
                className="botonNegro2"
                disabled={!contrasenaValida}
              >
                {loading ? <Spinner color="light" /> : "Enviar"}
              </Button>
           </div>     
          </Col>
        </Row>
      </div>
  );
}

export default ConfirmarContrasena;
