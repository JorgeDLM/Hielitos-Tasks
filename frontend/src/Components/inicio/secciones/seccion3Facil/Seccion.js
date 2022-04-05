import React, { PureComponent } from "react";
import { Row, Col, Card } from "reactstrap";
import Frame from "../../secciones/frameFullPage/Frame";
import { FaCaretRight, FaSquare, FaAward } from "react-icons/fa";
import Registro from "../../iniciarSesion/LoginModal"

class Inicio extends PureComponent {
	state = {
		active: false
	};

	active(e) {
		if (e === this.props.id) {
			this.setState({
				active: !this.state.active
			});
		}
	}

	render() {
		return (
			<React.Fragment>
				<Frame
					id={this.props.id}
					className={this.props.className}
					clase="botonAmarillo"
				>
					{this.props.id && this.active.bind(this)}
					<Row className=" parenorme negro">
						<Col
							xs={12}
							md={{ size: 10, offset: 1 }}
							lg={{ size: 8, offset: 2 }}
						>
							<Card className="letraFacil wbold fondoBlanco pizmediano parmediano">
								Es así de fácil...
							</Card>
							<div className={"fadeIn2"}>
								<Registro otro registro>
									<div className="tituloFacil pizenorme pargrande mouseSelectClick">
										<div className="wbold">
											<FaCaretRight /> Registrate{" "}
										</div>
										<div className="pizmuygrande subtituloFacil negro">
											<FaSquare className="tmuychica blanco" />{" "}
											¡Da click aquí!
										</div>
									</div>
								</Registro>
							</div>

							<div className={"fadeIn3"}>
								<div className="pizenorme pargrande">
									<div className="tituloFacil wbold">
										<FaCaretRight /> Realiza tu pedido{" "}
									</div>
									<div className="pizmuygrande subtituloFacil negro">
										<FaSquare className="tmuychica blanco" />{" "}
										Elige todos los productos que necesites
									</div>
								</div>
							</div>
							<div className={"fadeIn4"}>
								<div className="pizenorme pargrande">
									<div className="tituloFacil wbold">
										<FaCaretRight /> Entregamos{" "}
									</div>

									<div className="pizmuygrande subtituloFacil negro pabenorme">
										<FaSquare className="tmuychica blanco" />{" "}
										En tiempo y lugar acordado
									</div>
								</div>
							</div>
							<div className={"fadeIn5"}>
								<div className="pizenorme subtituloFacil">
									<FaAward className="negro tenorme" />{" "}
									Producto y servicio garantizado{" "}
								</div>
							</div>
						</Col>
					</Row>
				</Frame>
			</React.Fragment>
		);
	}
}

export default Inicio;
