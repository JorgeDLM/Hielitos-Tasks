import React, { useContext, useState } from "react";
import { Card, Row, Col, Button, Input, InputGroup, Spinner } from "reactstrap";
import { FaMinus, FaPlus } from 'react-icons/fa'
import UsuarioContext from "../context/UsuarioContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase-config";
import swal from "sweetalert";

function ProductoVentas(props) {

    const {productos, setProductos, loading, setLoading} = useContext(UsuarioContext)

    const [cantidad, setCantidad] = useState("")
    const [busqueda, setBusqueda] = useState(false)

    if (props.cambio >= 1 && !busqueda){
        setBusqueda(true)
        setCantidad("")
    }
    
    if (props.cambio === 0 && busqueda){
        setBusqueda(false)
        setCantidad("")
    }

    // AGREGAR INVENTARIO
    const crearVenta = async() => {
        setLoading(true)
        try {
            const suma = productos.filter(p => (p.id === props.p.id) && ((+props.p.cantidad === 0) ? (+cantidad) : (+cantidad + p.cantidad)))
            const setInfo = [...productos.filter(p => (p.id === props.p.id) ? [p.cantidad] = [((+props.p.cantidad === 0) ? (+cantidad) : (+cantidad + p.cantidad))] : p)]
            await updateDoc(doc(db, "productos", props.p.id), {cantidad: suma[0].cantidad})
            setProductos(setInfo)
            localStorage.setItem('productoInfo', JSON.stringify(setInfo));
            setCantidad("")
            setLoading(false)
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
            if ((+props.p.cantidad - +cantidad) >= 0){
                await updateDoc(doc(db, "productos", props.p.id), {cantidad: (+props.p.cantidad - +cantidad)})
                const setInfo = [...productos.filter(p => (p.id === props.p.id) ? [p.cantidad] = [(p.cantidad - +cantidad)] : p)]
                setProductos(setInfo)
                localStorage.setItem('productoInfo', JSON.stringify(setInfo));
                setCantidad("")
                setLoading(false)
            }
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



    const onEnter = (e) => {
        if (e.key === 'Enter'){
            crearVenta(); 
            restarInventario()
        }
        if (e.key === '+' || e.key === '-' || e.key === 'e' || e.key === 'E'){
            e.preventDefault();
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
                                <Col xs={12} md={12}>
                                    <InputGroup>
                                        <Button disabled={!cantidad || ((+props.p.cantidad - +cantidad) < 0)} className="botonInputAmarillo" onClick={restarInventario}>{loading ? <Spinner size="sm" /> : <FaMinus className="claseIconos" />}</Button>
                                        <Input type="number" className="letraEditarDatosInput" value={cantidad} placeholder={`# ${props.p.cantidad > 0 ? props.p.cantidad : 0}`} onChange={(e) => setCantidad(e.target.value)} 
                                            // onBlur={() => {crearVenta()}}
                                            onKeyPress={(e) => onEnter(e)}
                                        />
                                        <Button disabled={!cantidad} className="botonInputAzul" onClick={crearVenta}>{loading ? <Spinner size="sm" /> : <FaPlus className="claseIconos" />}</Button>
                                    </InputGroup>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </div>
            </Card>
        </div>
    );
}

export default ProductoVentas;
