import React, { useState } from "react";
import { Card, Row, Col, Button } from "reactstrap";
import { FaCopy } from 'react-icons/fa'
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


    // AGREGAR INVENTARIO
    // const agregarInventario = async() => {
    //     setLoading(true)
    //     try {
    //         const suma = productos.filter(p => (p.id === props.p.id) && ((+props.p.cantidad === 0) ? (+cantidad) : (+cantidad + p.cantidad)))
    //         const setInfo = [...productos.filter(p => (p.id === props.p.id) ? [p.cantidad] = [((+props.p.cantidad === 0) ? (+cantidad) : (+cantidad + p.cantidad))] : p)]
    //         await updateDoc(doc(db, "productos", props.p.id), {cantidad: suma[0].cantidad})
    //         setProductos(setInfo)
    //         localStorage.setItem('productoInfo', JSON.stringify(setInfo));
    //         setCantidad("")
    //         setLoading(false)
    //     } catch (error) {
    //         swal({
    //             title: "Error",
    //             text: error.message,
    //             icon: "error",
    //             button: "cerrar"
    //         });
    //         setLoading(false)
    //     }
    // }    



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
                                {props.p.cantidad !== 0 && <Col><span className="gris">{props.p.cantidad} {props.p.cantidad > 1 ? "pzas" : "pza"}</span></Col>}
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
        </div>
    );
}

export default ProductoPorSubir;
