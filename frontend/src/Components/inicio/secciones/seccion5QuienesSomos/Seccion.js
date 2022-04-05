import React, { PureComponent } from "react";
import { Row, Col } from "reactstrap";
import Frame from "../../secciones/frameFullPage/Frame";
// import { FaChevronCircleRight } from "react-icons/fa";
import logo from "../../../../imgs/logoBlanco.png";
import Mision from "./Mision";

class Inicio extends PureComponent {
	state = {
		open: 1
	};

	setOpen(sig) {
		this.setState((state, props) => ({
			open: sig
		}));
	}

	misionF() {
		this.setState({
		  open: 1
		});
	  }

	  visionF() {
		this.setState({
		  open: 2
		});
	  }

	  valoresF() {
		this.setState({
		  open: 2
		});
	  }


	quienesSomos = (
		<div>
		Somos un grupo de emprendedores visionarios, que buscan mejorar el sistema de compras de frutas y verduras (calidad, precio, frescura, accesibilidad, comodidad). Buscamos ser el <span className="wbold azul">intermediario directo</span> entre los productores directos (comunidades) y los consumidores finales, comprandoles a los productores a un precio más justo y vendiendolo a precio competitivo.
		</div>
		)
	mision = (
		<div>
		Dar los <span className="wbold">mejores precios</span> en el mercado. Proveyendo productos de calidad y brindando siempre un servicio de primera.
		</div>
		)
	vision = (
		<div>
		Generar <span className="wbold">cadena de bienestar</span> desde el productor hasta el cliente. Otorgándo un servicio Premium.
		</div>
		)
	
	valores = ["- Confianza", "- Garantía", "- Transparencia", "- Solidaridad", "- Fair Trade"  ] 

	render() {
			return (
			<React.Fragment>
				<Frame
					id={this.props.id}
					className={(this.props.className || " fondoRojo") + " "}
					clase="botonAmarillo"
					padding="0px"
				>
					<Row className="fondoNegro">
						<Col
							xs={12}
							className="d-block d-sm-none blanco tgrande centro wbold parmediano"
						>
							Quiénes Somos
						</Col>
						<Col sm={4} className="d-none d-sm-block">
							<div className="paddingLogo">
								<img
									className="logoQuienes"
									src={logo}
									alt="error"
								/>
							</div>
						</Col>
						<Col xs={12} sm={8}>
							<div className=" pabmediano letraQuienes centro blanco">
								{this.quienesSomos}
							</div>
						</Col>
					</Row>

					<Row className="paddingResponsivo">
						{/*pantalla xs chica*/}
						<Col
							xs={12}
							className="d-block d-md-none centro parchico"
						>
							<Mision
								val={1}
								actual={this.state.open}
								sig={2}
								setOpen={this.setOpen.bind(this)}
								className="tchica"
								color="azul"
								mision
								onClick={this.misionF.bind(this)}
							>
								{this.mision}
							</Mision>
							<Mision
								val={2}
								actual={this.state.open}
								sig={3}
								setOpen={this.setOpen.bind(this)}
								className="tchica"
								color="azul"
								vision
								onClick={this.visionF.bind(this)}
							>
								{this.vision}
							</Mision>
							<Mision
								val={3}
								actual={this.state.open}
								setOpen={this.setOpen.bind(this)}
								sig={1}
								className="tchica"
								color="azul"
								valores
								onClick={this.valoresF.bind(this)}
							>
								{this.valores.map((valor, i) => (
									<React.Fragment>
										<div id={i}>{valor}</div> 
									</React.Fragment>
								))}
							</Mision>
						</Col>
						{/*pantalla md*/}
						<Col
							xs={12}
							md={{ size: 11, offset: 1 }}
							xl={{ size: 9, offset: 2 }}
							className="d-none d-md-block"
						>
							<Row className="  letraMision amarillo wbolder mayus">
								{/*pantalla grande*/}
								<Col
									className="misionHover d-none d-md-block paddingResponsivo"
								>
									<div className=" tgrande d-inline icon-mision-1" />{" "}
									<div className="centradoIcono d-inline">
										Misión
									</div>{" "}
								</Col>
								<Col
									className="misionHover d-none d-md-block paddingResponsivo"
								>
									<div className=" tgrande d-inline icon-vision-1" />{" "}
									<div className="centradoIcono d-inline">
										Visión
									</div>{" "}
								</Col>
								<Col
									className="misionHover d-none d-md-block paddingResponsivo"
								>
									<div className=" tgrande d-inline icon-valores" />{" "}
									<div className="centradoIcono d-inline">
										valores
									</div>
								</Col>
							</Row>
							<Row className="letraExplicacion ">
								<Col className="justificado d-none d-md-block">
									{this.mision}
								</Col>
								<Col className=" justificado d-none d-md-block">
									{this.vision}
								</Col>
								<Col className=" justificado d-none d-md-block">
									{this.valores.map((valor, i) => (<div id={i}>{valor}</div>))}
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
