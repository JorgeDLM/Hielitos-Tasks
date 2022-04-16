import React, { useState } from "react";
import { Card, Row, Col, Button } from "reactstrap";
import { FaCopy, FaPlus } from 'react-icons/fa'
// import UsuarioContext from "../context/UsuarioContext";
// import { doc, updateDoc } from "firebase/firestore";
// import { db } from "../../../firebase-config";
// import swal from "sweetalert";

function ProductoPorSubir(props) {

    // const {productos, setProductos, loading, setLoading} = useContext(UsuarioContext)

    const [ver, setVer] = useState(false)


    const copiar = () => {
        navigator.clipboard.writeText(props.p.descripcion)
    }


    const palabras = props.p.nombre.split(" ");
    const nombre = palabras.map(p => ((p[0] !== undefined && p[0]?.toUpperCase()) === false ? "" : (p[0] !== undefined && p[0]?.toUpperCase())) + (p !== undefined && p.substring(1).toLowerCase()) + " ")

    return (
        <>
            {!(props.p.subido && props.p.subido_amazon && props.p.subido_facebook) && <div className="parchico">
                <Card className="claseCard">
                    <div className="pmediano">
                        <Row>
                            <Col xs={4} md={3}>
                                <div className="pizchico"><img className="productoLista" src={props.p.imagen} alt="error" /></div>
                            </Col>
                            <Col>
                                <div className="t16">{nombre}</div>
                                <Row className="parchico">
                                    <Col>{!props.p.subido ? <><Button className="botonVerdeComentario" ><FaPlus className="claseIconos" /></Button> ML</> : "Subido en ML"}</Col>
                                    <Col>{!props.p.subido_amazon ? <><Button className="botonVerdeComentario" ><FaPlus className="claseIconos" /></Button> Amazon</> : "Subido en Amazon"}</Col>
                                    <Col>{!props.p.subido_facebook ? <><Button className="botonVerdeComentario" ><FaPlus className="claseIconos" /></Button> FB</> : "Subido en FB"}</Col>
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
                            <div className="descripcion">
                                <Row className="wbold azul">
                                    <Col>Descripción: </Col>
                                    <Col className="derecha"><Button onClick={copiar} className="botonAzul"><FaCopy className="claseIconos" /></Button></Col>
                                </Row>
                             <br />{props.p.descripcion}</div>
                            <div><span className="wbold azul">Inventario:</span> {props.p.cantidad}</div>
                            <div><span className="wbold azul">Proveedor:</span> {props.p.proveedor}</div>
                        </div>}
                    {ver && <Button onClick={() => setVer(!ver)} className="botonAmarillo w100">Ver menos</Button>}
                </Card>
            </div>}
        </>
    );
}

export default ProductoPorSubir;
