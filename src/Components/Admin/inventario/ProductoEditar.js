import React, { useContext, useState } from "react";
import { Card, Row, Col, Button, Input, InputGroup } from "reactstrap";
import { FaCopy, FaPlus } from 'react-icons/fa'
import UsuarioContext from "../context/UsuarioContext";


function ProductoEditar(props) {

    const {productos, setProductos, loading, setLoading} = useContext(UsuarioContext)

    const [editar, setEditar] = useState(false)
    const [cantidad, setCantidad] = useState("")

    const copiar = () => {
        navigator.clipboard.writeText(props.p.descripcion)
    }
    // AGREGAR INVENTARIO
    const agregarInventario = async() => {
        setLoading(true)
        try {
            await updateDoc(doc(db, "usuarios", usuario.id), {telefono: telefono})
        } catch (error) {
            swal({
                title: "Error",
                text: error.message,
                icon: "error",
                button: "cerrar"
            });
            setLoading(false)
        }
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
                            <div className="t12">{props.p.nombre.toUpperCase()}</div>
                            <Row className="parchico">
                                <Col xs={6}>
                                    <InputGroup>
                                        <Input type="text" className="letraEditarDatosInput" placeholder={`Cantidad: ${props.p.cantidad > 0 ? props.p.cantidad : 0}`} onChange={(e) => setCantidad(e.target.value)} />
                                        <Button className="botonInputAzul"><FaPlus className="claseIconos" /></Button>
                                    </InputGroup>
                                </Col>
                                {props.p.envio === true && <Col className="wbold verde t12">Envío gratis</Col>}
                                <Col><span className="wbold azul">{props.p.propietario}</span></Col>
                            </Row>
                        </Col>
                    </Row>
                    {editar && <hr />}
                </div>
                {!editar && <Button onClick={() => setEditar(!editar)} className="botonAmarillo w100">Ver más</Button>}
                    {editar && <div className="pizchico pdechico pabchico">
                        <div><span className="wbold azul">Mercadolibre:</span> ${props.p.precio_venta_ml}</div>
                        <div><span className="wbold azul">Retail:</span> ${props.p.precio_venta}</div>
                        <div><span className="wbold azul">Mayoreo:</span> ${props.p.precio_venta_mayoreo}</div>
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

export default ProductoEditar;
