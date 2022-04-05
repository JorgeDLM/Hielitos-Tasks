import React, { useState } from "react";
import { Row, Col, Button, Spinner } from "reactstrap";
import Frame from "../../secciones/frameFullPage/Frame";
import { FaClock, FaChevronRight } from "react-icons/fa";
import Registro from "../../iniciarSesion/LoginModal";
import swal from "sweetalert";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../../../firebase-config";

function Seccion(props) {

    const [nombre, setNombre] = useState("")
    const [email, setEmail] = useState("")
    const [telefono, setTelefono] = useState("")
    const [mensaje, setMensaje] = useState("")
    const [loading, setLoading] = useState(false)
	  
	
	const emailValido = email !== "" && email.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
	const nombreValido = nombre !== ""
	const telefonoValido = telefono  !== "" && telefono.length === 10
    
	
	const validacion = (
		nombreValido &&
		emailValido &&
		telefonoValido &&
		mensaje !== ""
	  )
	

    const submitHandler = async () => {
		setLoading(true);
		if(!validacion){
		  swal({
			title: "Error",
			text: `${!nombreValido ? "Nombre invalido." : ""} ${!emailValido ? "Correo electrónico invalido." : ""} ${!telefonoValido ? "Teléfono invalido." : ""} ${!mensaje ? "Ingrese un mensaje." : ""}`,
			icon: "warning",
			button: "Cerrar"
		  });
		  setLoading(false);
		  return;
		}
		try {
			
            // CREAR MENSAJE INICIO:
            const crearMensaje = async () => {
                await addDoc(collection(db, "mensajes_inicio"), {
					nombre: nombre, 
					email: email,
					telefono: telefono,
					mensaje: mensaje,
				})
            }
            crearMensaje()
			
			swal({
			  title: "Gracias",
			  text: "¡Te contactaremos a la brevedad!",
			  icon: "success",
			  button: "Cerrar"
			});
			setNombre("")
			setEmail("")
			setTelefono("")
			setMensaje("")
			setLoading(false);
		  } catch (error){
			swal({
			  title: "Error inesperado",
			  text: error.response.data.message,
			  icon: "error",
			  button: "Cerrar"
			});
			setLoading(false);
		}
	  }
  
	return (
		<React.Fragment>
			<Frame
				id={props.id}
				className={props.className || " fondoRojo"}
				clase="botonRojo"
			>
				<section className=" parenorme blanco sinpym">
					<Row>
						<Col xs={12} md={6}>
							<Row className="paddingContacto">
								<Col
									xs={12}
									className="wbold rojo letraHaz centro"
								>
									HAZ TU PEDIDO
								</Col>
								<Col xs={12} className="paddingPedido">
									<Row className="wbold rojo">
										<Col
											xs={{ size: 2, offset: 1 }}
											sm={3}
											md={2}
											lg={3}
											className="iconoReloj derecha sinpymde"
										>
											<FaClock />
										</Col>
										<Col className="letraHorario">
											HORARIO DE ATENCIÓN <br />
											7:00 AM - 11:00 PM
										</Col>
									</Row>
								</Col>

								<Col
									xs={12}
									className="blanco centro paddingBotonContacto"
								>
									<Registro otro registro>
										<Button className=" botonRegistrate botonBlanco">
											¡Registrate aquí!
										</Button>
									</Registro>
								</Col>
							</Row>
						</Col>

						<Col>
							<Row className="paddingEstaremos">
								<Col
									xs={12}
									md={9}
									className="letraEstaremos wbolder espaciado"
								>
									Estaremos felices{" "}
									<br className="espaciado" />
									de atenderte
								</Col>
								<Col xs={12} md={9}>
									<input
										type="text"
										placeholder="Nombre"
										className="inputContacto"
										value={nombre}
										onChange={(e) => setNombre(e.target.value)}
									/>
								</Col>
								<Col
									xs={12}
									md={9}
									className="paddingInput"
								>
									<input className="inputContacto"name="email" type="email" value={email} placeholder="Correo eletrónico" onChange={e => setEmail(e.target.value.toLowerCase())} 
										invalid={emailValido} 
                                	/>
								</Col>
								<Col
									xs={12}
									md={9}
									className="paddingInput"
								>
									<input
										className="inputContacto" name="telefono" type="tel" value={telefono} maxLength={10} placeholder="Teléfono" onChange={e => setTelefono(e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1'))} 
                                    invalid={telefono !== '' && telefono.length < 10}
                                	/>
								</Col>
								<Col
									xs={12}
									md={9}
									className="paddingInput"
								>
									<div className="contenedor">
										<textarea
											placeholder="Mensaje"
											className="inputContacto"
											rows="7"
											value={mensaje}
											onChange={(e) => setMensaje(e.target.value)}
										/>
										<div className="bottom-right">
											<Button onClick={submitHandler} className="botonNegro2">
												{!loading ? <React.Fragment>
													Enviar{" "}
													<FaChevronRight className="tmuychica" />
													<FaChevronRight className="tmuychica" />
												</React.Fragment>:
												<Spinner size="sm" /> }
											</Button>
										</div>
									</div>
								</Col>
							</Row>
						</Col>
					</Row>
				</section>
			</Frame>
		</React.Fragment>
	);
}

export default Seccion;
