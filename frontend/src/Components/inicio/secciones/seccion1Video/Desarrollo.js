import React, { PureComponent } from "react";
import { Row, Col, Button } from "reactstrap";

class Desarrollo extends PureComponent {
	render() {
		return (
			<section className="centro parchico fondoBlanco blanco pabgrande">
				*area de desarrollo para ir cambiando de front{" "}
				<Row>
					<Col xs={6}>
						<Button className="botonBlanco1 w100" href="/clientes">
							clientes
						</Button>
						<br />
						<Button className="botonBlanco3 w100" href="/socios">
							socios
						</Button>
						<br />
						<Button className="botonBlanco2 w100" href="/admin">
							admin
						</Button>
					</Col>
					<Col xs={6}>
						<Button className="botonBlanco4 w100" href="/registro">
							registro
						</Button>
						<br />
						<Button className="botonBlanco1 w100" href="/imprimir">
							impresion
						</Button>
						<br />
						<Button className="botonBlanco2 w100" href="/chofer">
							chofer
						</Button>
						<br />
						<Button
							className="botonBlanco3 w100"
							href="/empleadocompras"
						>
							empleado compras
						</Button>
					</Col>
				</Row>
			</section>
		);
	}
}

export default Desarrollo;
