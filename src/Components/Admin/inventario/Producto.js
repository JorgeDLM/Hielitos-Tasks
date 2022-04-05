import React, { useState } from "react";
import { Card, Row, Col, Button } from "reactstrap";


function Producto(props) {

    const [ver, setVer] = useState(false)

    return (
        <div className="parchico">
            <Card className="claseCard">
                <div className="pmediano">
                    <Row>
                        <Col xs={4}>
                            <div className="pizchico"><img className="productoLista" src={props.p.imagen} alt="error" /></div>
                        </Col>
                        <Col>
                            <div className="t20">{props.p.nombre.toUpperCase()}</div>
                            <Row className="parchico">
                                <Col>${props.p.precio_venta}</Col>
                                {props.p.envio === true && <Col className="wbold verde">Envío gratis</Col>}
                                <Col><span className="wbold azul">{props.p.propietario}</span></Col>
                            </Row>
                        </Col>
                    </Row>
                    {ver && <hr />}
                </div>
                {!ver && <Button onClick={() => setVer(!ver)} className="botonAmarillo w100">Ver más</Button>}
                    {ver && <div className="pizchico pdechico pabchico">
                        <div><span className="wbold azul">Temática:</span> {props.p.tematica}</div>
                        <div><span className="wbold azul">Categoria:</span> {props.p.categoria}</div>
                        <div><span className="wbold azul">Precio de compra:</span> {props.p.precio_compra}</div>
                        <div><span className="wbold azul">Ganancia:</span> {props.p.precio_venta - props.p.precio_compra - (props.p.precio_venta >= 299 ? (props.p.envio === true ? 72 : 0) : (props.p.envio === true ? 100 : 0))}</div>
                        <div><span className="wbold azul">Medidas:</span> {props.p.medidas}</div>
                        <hr />
                        <div className="descripcion"><span className="wbold azul">Descripción:</span> <br />{props.p.descripcion}</div>
                        <div><span className="wbold azul">Inventario:</span> {props.p.cantidad}</div>
                        <div><span className="wbold azul">Proveedor:</span> {props.p.proveedor}</div>
                    </div>}
                {ver && <Button onClick={() => setVer(!ver)} className="botonAmarillo w100">Ver menos</Button>}
            </Card>
        </div>
    );
}

export default Producto;
