import React, { useState } from "react";
import { Card, Row, Col, Button } from "reactstrap";
import { FaCopy, FaPlus, FaCheck } from 'react-icons/fa'
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase-config";
import swal from "sweetalert";

function ProductoPorSubir(props) {

    const [ver, setVer] = useState(false)
    const [ML, setML] = useState(props.p.subido)
    const [amazon, setAmazon] = useState(props.p.subido_amazon)
    const [facebook, setFacebook] = useState(props.p.subido_facebook)


    const copiar = () => {
        navigator.clipboard.writeText(props.p.descripcion)
    }


    const actualizarProductoML = async() => {
        try {
            const data = {
                subido: !ML,
            }
            await updateDoc(doc(db, "productos", props.p.id), data)
            swal({
                title: "Producto actualizado con exito",
                icon: "success"
            })
        } catch (error) {
            console.log(error)
        }
    }

    const actualizarProductoAmazon = async() => {
        try {
            const data = {
                subido_amazon: !amazon,
            }
            await updateDoc(doc(db, "productos", props.p.id), data)
            swal({
                title: "Producto actualizado con exito",
                icon: "success"
            })
        } catch (error) {
            console.log(error)
        }
    }

    const actualizarProductoFB = async() => {
        try {
            const data = {
                subido_facebook: !facebook,
            }
            await updateDoc(doc(db, "productos", props.p.id), data)
            swal({
                title: "Producto actualizado con exito",
                icon: "success"
            })
        } catch (error) {
            console.log(error)
        }
    }

    const palabras = props.p.nombre.split(" ");
    const nombre = palabras.map(p => ((p[0] !== undefined && p[0]?.toUpperCase()) === false ? "" : (p[0] !== undefined && p[0]?.toUpperCase())) + (p !== undefined && p.substring(1).toLowerCase()) + " ")

    return (
        <>
            {/* {!(ML && amazon && facebook) && <div className="parchico"> */}
            {<div className="parchico">
                <Card className="claseCard">
                    <div className="pmediano">
                        <Row>
                            <Col xs={4} md={3}>
                                <div className="pizchico"><img className="productoLista" src={props.p.imagen} alt="error" /></div>
                            </Col>
                            <Col>
                                <div className="t16">{nombre}</div>
                                <Row className="parchico">
                                    <Col>{!ML ? <><Button className="botonAmarilloComentario" onClick={() => {setML(true); actualizarProductoML()}} >
                                        <FaPlus className="claseIconos" /></Button> ML</> : 
                                        <><Button onClick={() => {setML(false); actualizarProductoML()}} className="botonVerdeComentario" ><FaCheck className="claseIconos" /></Button> Subido en ML</>}</Col>

                                    <Col>{!amazon ? <><Button className="botonAmarilloComentario" onClick={() => {setAmazon(true); actualizarProductoAmazon()}} >
                                        <FaPlus className="claseIconos" /></Button> Amazon</> : 
                                        <><Button onClick={() => {setAmazon(false); actualizarProductoAmazon()}} className="botonVerdeComentario" ><FaCheck className="claseIconos" /></Button> Subido en Amazon</>}</Col>

                                    <Col>{!facebook ? <><Button className="botonAmarilloComentario" onClick={() => {setFacebook(true); actualizarProductoFB()}} >
                                        <FaPlus className="claseIconos" /></Button> FB</> : 
                                        <><Button onClick={() => {setFacebook(false); actualizarProductoFB()}} className="botonVerdeComentario" ><FaCheck className="claseIconos" /></Button> Subido en FB</>}</Col>
                                </Row>
                            </Col>
                        </Row>
                        {ver && <hr />}
                    </div>
                    {!ver && <Button onClick={() => setVer(!ver)} className="botonTransparente w100 azul wbold">Ver más</Button>}
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
                    {ver && <Button onClick={() => setVer(!ver)} className="botonTransparente w100 azul wbold">Ver menos</Button>}
                </Card>
            </div>}
        </>
    );
}

export default ProductoPorSubir;
