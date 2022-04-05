import React, { PureComponent } from "react";
import { Row, Col, Card, Button } from "reactstrap";

import Frame from "../frameFullPage/Frame";
import { FaChevronCircleDown } from "react-icons/fa";
// import Desarrollo from "./Desarrollo";
import IniciarSesionModal from "../../iniciarSesion/LoginModal";
import fondo from "../../../../imgs/fondo.jpg"

class Seccion extends PureComponent {
	render() {
		return (
			<Frame
				id={this.props.id}
				clase="botonBlanco"
				className={this.props.className || " fondoRojo"}
				fondo= {`url(${fondo})`}
			>
				{/* 
				TODO: ocultar esta vista de desarrollo*/}
				{/*<Desarrollo />*/}
				<Col md={1} className="d-none d-md-block" />
				<section>
					<Row>
						{/*pantalla chica*/}
						<Col
							id="naveg3"
							className="parenorme centro"
						>
							<Card className="parmediano pabmuygrande transparente">
								<span className="d-block d-sm-none pmediano textoInicio wbold">
									"Del campo a tu mesa..."
								</span>
								<span className="pmediano textoInicio wbold centro d-none d-sm-block">
									"Ir al mercado nunca había sido tan
									fácil..."
								</span>
								<div>
									<IniciarSesionModal registro otro> 
										<Button className="botonInicio parmuychico pizmediano pdemediano">
											¡Registrate Aquí!
										</Button>
									</IniciarSesionModal>
								</div>
							</Card>
						</Col>
					
					</Row>
					<div className="centro tenorme naveg4">
						<FaChevronCircleDown
							onClick={() =>
								this.props.fullpageApi.moveSectionDown()
							}
							className="chevronInicio"
						/>
					</div>
				</section>
				<Col md={1} className="d-none d-md-block" />
			</Frame>
		);
	}
}

export default Seccion;
