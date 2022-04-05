import React from "react";
import Menu from "../menu/Menu";
import { Container, Card, Row, Col, Button } from 'reactstrap'
import { FaUndo } from 'react-icons/fa'
import { useNavigate } from "react-router-dom";


function ProductoID(props) {
   
	const links = [
		{
			nombre: "Catálogo",
			path: `/catalogo`,
		},
	];

    const navigate = useNavigate()
    const regresar = () => {
        navigate(`/catalogo`)
    }

 
    return (
        <React.Fragment>
            <Menu links={links} logoNegro  />
            <Container className="parmediano pabenorme noselect">
                <Card className="pabgrande pizgrande pdegrande">
                    <Row>
                        <Col className="centro"><img src={props.p.imagen} className="tImagenID" alt="error imagen" /></Col>
                        <Col xs={12} md={4} className="parenorme izquierda t26 d-md-block d-none">
                            {/* PANTALLA MEDIANA */}
                            <Card className="pchico">
                                {props.p.precio_venta_ml >= 0 && <div className="lineaEnmedio">${props.p.precio_venta_ml}</div>}
                                    <div className="azul">${props.p.precio_venta}</div>
                                {props.p.precio_venta_mayoreo >= 0 && <div className="t18">${props.p.precio_venta_mayoreo} <span className="t14">(Más de 5 piezas)</span></div>}
                                <hr />
                                <div className="verdeObscuro t15 wbold pabchico">{props.p.envio ? "Envío" : "Envío no incluido" }</div>
                           </Card>
                        </Col>
                    </Row>
                    <div className="wbold t19 centro pabchico">{props.p.nombre}</div>
                    {/* PANTALLA CHICA */}
                    <Card className="pchico d-md-none d-block fondoAmarilloClaro">
                        <Row>
                            <Col className="verdeObscuro t15 wbold pabchico contenedor"><span className="centradoRelativo2">{props.p.envio ? "Envío incluido" : "Envío no incluido" }</span></Col>
                            <Col>
                                    {props.p.precio_venta_ml >= 0 && <div className="lineaEnmedio d-inline t20">${props.p.precio_venta_ml}</div>}
                                        <div className="t22 azul d-inline pizchico">${props.p.precio_venta}</div>
                                    {props.p.precio_venta_mayoreo >= 0 && <div className="t18">${props.p.precio_venta_mayoreo} <span className="t14">(Más de 5 piezas)</span></div>}
                            </Col>
                        </Row>
                    </Card>
                    <Card className="t12 descripcion negro pmediano"><div className="izquierda wbold t15">Descripción:</div>{props.p.descripcion}</Card>
                    
                <div className="parmediano"><Button onClick={() => regresar()} className="botonBlanco w100"><FaUndo className="tIconos" /> Regresar</Button></div>
                </Card>
            </Container>
       </React.Fragment>
    );
}

export default ProductoID;
