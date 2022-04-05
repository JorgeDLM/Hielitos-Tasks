import React, { PureComponent } from "react";
import { Row, Col } from "reactstrap";
import Frame from "../../secciones/frameFullPage/Frame";
import brocoli from "../../../../imgs/1brocoli.png";
import cherry from "../../../../imgs/1cherry.jpg";
import mango from "../../../../imgs/1huevo.jpg";
import nueces from "../../../../imgs/1nueces.jpg";

class Inicio extends PureComponent {
	render() {
		return (
			<React.Fragment>
				<Frame
					id={this.props.id}
					className={this.props.className || " fondoRojo"}
					clase="botonAmarillo"
				>
					<section className="paddingSeccion parenorme blanco">
						<Row>
							{/*area fotos productos*/}
							<Col xl={1} className="d-none d-xl-block" />
							<Col
								md={6}
								xl={4}
								className="d-none d-md-block paddingCompraLMP"
							>
									<div className="mayus wbold compralmp">
										compra los mejores productos
									</div>
								<Row>
									<Col xs={6} className="sinpymde">
										<div className="w100 h100 textoImagen">
											<img
												className="w100 h100 imagenHover"
												src={cherry}
												alt="error"
											/>
											<div className="centrado mayus frutasTexto wbolder">
												Frutas
											</div>
										</div>
									</Col>
									<Col xs={6} className="sinpymiz">
										<div className="w100 h100 textoImagen">
											<img
												className="w100 h100 imagenHover"
												src={brocoli}
												alt="error"
											/>
											<div className="centrado mayus frutasTexto wbolder">
												verduras{" "}
												<br className="sinpymar sinpymab" />
												y hierbas
											</div>
										</div>
									</Col>
									<Col xs={6} className="sinpymde">
										<div className="w100 h100 textoImagen">
											<img
												className="w100 h100 imagenHover"
												src={nueces}
												alt="error"
											/>
											<div className="centrado mayus frutasTexto wbolder">
												nueces, <br />
												semillas, chiles
												<br />y especies
											</div>
										</div>
									</Col>
									<Col xs={6} className="sinpymiz">
										<div className="w100 h100 textoImagen">
											<img
												className="w100 h100 imagenHover"
												src={mango}
												alt="error"
											/>
											<div className="centrado mayus frutasTexto wbolder">
												productos <br />
												animales
											</div>
										</div>
									</Col>
								</Row>
							</Col>
							{/*area porque somos tu mejor opcion*/}
							<Col
								xs={12}
								sm={12}
								md={6}
								xl={7}
								className="paddingPorque"
							>
								<div className="pizPorque">
									<div className="letraPorque">
										¿Por qué somos <br /> tu mejor opción?
									</div>
									<div className="paddingPorque2">
										<div className="letraPorqueAmarilla ">
											Para tu casa o negocio
											{/* Genera tu pedido desde la comodidad de */}
											{/* tu casa */}
										</div>
										<div className="letraPorqueBlanca">
											Facilitamos tus compras de productos de
											campo.
										</div>
									</div>
									<div className="parmediano">
										<div className="letraPorqueAmarilla ">
											Entrega sin costo
										</div>
										<div className="letraPorqueBlanca">
											Para pedidos de $500 o más
											{/* ¡No tenemos costo de envío! */}
										</div>
									</div>
									<div className="parmediano">
										<div className="letraPorqueAmarilla ">
											Precios bajos
										</div>
										<div className="letraPorqueBlanca">
											Te invitamos a que compares nuestros
											precios.
										</div>
									</div>
									<div className="parmediano">
										<div className="letraPorqueAmarilla ">
											Calidad y productos garantizados
										</div>
										<div className="letraPorqueBlanca">
											Si un producto llega mal o maltratado,
											no te preocupes nosotros te lo reponemos
											sin costo alguno.
										</div>
									</div>
								</div>
							</Col>
						</Row>
					</section>
				</Frame>
			</React.Fragment>
		);
	}
}

export default Inicio;
