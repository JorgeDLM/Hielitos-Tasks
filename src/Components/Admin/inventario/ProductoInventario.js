import React, { useState } from "react";
import { Card, Row, Col, Button } from "reactstrap";
import { FaCopy } from 'react-icons/fa'


function ProductoInventario(props) {

    const [editar, setEditar] = useState(false)

    const copiar = () => {
        navigator.clipboard.writeText(props.p.descripcion)
    }

    return (
        <div className="parchico">
            <Card className="claseCard">
                <div className="pmediano">
                    <Row>
                        <Col xs={4} md={3}>
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
                    {editar && <hr />}
                </div>
                {!editar && <Button onClick={() => setEditar(!editar)} className="botonAmarillo w100">Ver más</Button>}
                    {editar && <div className="pizchico pdechico pabchico">
                        <div><span className="wbold azul">Temática:</span> {props.p.tematica}</div>
                        <div><span className="wbold azul">Categoria:</span> {props.p.categoria}</div>
                        <div><span className="wbold azul">Precio de compra:</span> {props.p.precio_compra}</div>
                        <div><span className="wbold azul">Ganancia:</span> {props.p.precio_venta - props.p.precio_compra - (props.p.precio_venta >= 299 ? (props.p.envio === true ? 72 : 0) : (props.p.envio === true ? 100 : 0))}</div>
                        <div><span className="wbold azul">Medidas:</span> {props.p.medidas}</div>
                        <hr />
                        <div className="descripcion">
                            <Row className="wbold azul">
                                <Col>Descripción: </Col>
                                <Col className="derecha"><Button onClick={copiar} className="botonAzul"><FaCopy className="claseIconos" /></Button></Col>
                            </Row>
                         <br />{props.p.descripcion}</div>
                        <div><span className="wbold azul">Inventario:</span> {props.p.cantidad}</div>
                        <div><span className="wbold azul">Proveedor:</span> {props.p.proveedor}</div>
                    </div>}
                {editar && <Button onClick={() => setEditar(!editar)} className="botonAmarillo w100">Guardar</Button>}
                {editar && <Button onClick={() => setEditar(!editar)} className="botonRojo w100">Cancelar</Button>}
            </Card>
        </div>
    );
}

export default ProductoInventario;
