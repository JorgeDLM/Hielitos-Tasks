import React, { PureComponent } from "react";
import { Row, Col } from "reactstrap";
import Frame from "../../secciones/frameFullPage/Frame";
import { FaTruck } from "react-icons/fa";
class Inicio extends PureComponent {
	render() {
		return (
			<React.Fragment>
				<Frame
					id={this.props.id}
					className={this.props.className || " fondoRojo"}
					clase="botonBlanco1"
				>
					<Row className="parenorme blanco">
						<Col md={1} xl={2} className="d-none d-lg-block" />
						<Col xs={12} md={11} xl={10} className="paddingZona1">
							<FaTruck className="camionZona" />
						</Col>
						<Col md={1} xl={2} className="d-none d-lg-block" />

						<Col
							xs={12}
							sm={7}
							md={7}
							xl={5}
							className="paddingZona1 pabmuygrande"
						>
							<Row>
								<Col>
									<div className="tenorme wbold letraZona">
										ZONAS DE ENTREGA
									</div>
								</Col>
							</Row>
						</Col>
						<Col
							xs={12}
							sm={5}
							md={4}
							xl={3}
							className="paddingZona2"
						>
							<Row>
								<Col className="letraZonas">
									<div className="vl" />
									<div className="pizchico">
										{/*poner un inscroll por si son demasiadas y se salen de la pantalla*/}
										<div className="mayus">angelópolis</div>
										<div className="mayus">
											centro histórico
										</div>
										<div className="mayus">cholula</div>
										<div className="mayus">camino real</div>
										<div className="mayus">
											hermanos serdán
										</div>
										<div className="mayus">la 43</div>
										<div className="mayus">la noria</div>
										<div className="mayus">la paz</div>
										<div className="mayus">
											lomas de angelópolis
										</div>
										<div className="mayus">zavaleta</div>
										<div className="mayus">
											y muchas más...
										</div>
									</div>
								</Col>
							</Row>
						</Col>
					</Row>
				</Frame>
			</React.Fragment>
		);
	}
}

export default Inicio;
