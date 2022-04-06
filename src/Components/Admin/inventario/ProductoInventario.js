import React, { useContext, useState } from "react";
import { Card, Row, Col, Button, Input, InputGroup } from "reactstrap";
import { FaMinus, FaPlus } from 'react-icons/fa'
import UsuarioContext from "../context/UsuarioContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase-config";
import swal from "sweetalert";

function ProductoInventario(props) {

    const {productos, setProductos, loading, setLoading} = useContext(UsuarioContext)

    const [cantidad, setCantidad] = useState("")


    // AGREGAR INVENTARIO
    const agregarInventario = async() => {
        setLoading(true)
        try {
            const setInfo = [...productos.filter(p => (p.id === props.p.id) ? [p.cantidad] = [(+cantidad + p.cantidad)] : p)]
            console.log(setInfo)
            await updateDoc(doc(db, "productos", props.p.id), {cantidad: +cantidad + +props.p.cantidad})
            setProductos(setInfo)
            localStorage.setItem('productoInfo', JSON.stringify(setInfo));
            setCantidad("")
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

    // RESTAR INVENTARIO
    const restarInventario = async() => {
        setLoading(true)
        try {
            const setInfo = [...productos.filter(p => (p.id === props.p.id) ? [p.cantidad] = [(p.cantidad - +cantidad)] : p)]
            console.log(setInfo)
            await updateDoc(doc(db, "productos", props.p.id), {cantidad: +props.p.cantidad - +cantidad})
            setProductos(setInfo)
            localStorage.setItem('productoInfo', JSON.stringify(setInfo));
            setCantidad("")
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
                                        <Button disabled={!cantidad} className="botonInputAmarillo" onClick={restarInventario}><FaMinus className="claseIconos" /></Button>
                                        <Input type="text" className="letraEditarDatosInput" value={cantidad} placeholder={`Cantidad: ${props.p.cantidad > 0 ? props.p.cantidad : 0}`} onChange={(e) => setCantidad(e.target.value)} />
                                        <Button disabled={!cantidad} className="botonInputAzul" onClick={agregarInventario}><FaPlus className="claseIconos" /></Button>
                                    </InputGroup>
                                </Col>
                                {props.p.envio === true && <Col className="wbold verde t12">Envío gratis</Col>}
                                <Col><span className="wbold azul">{props.p.propietario}</span></Col>
                            </Row>
                        </Col>
                    </Row>
                </div>
            </Card>
        </div>
    );
}

export default ProductoInventario;
