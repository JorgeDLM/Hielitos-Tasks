import React, { useContext, useState } from "react";
import { Card, Row, Col, Button, Input, InputGroup, Spinner } from "reactstrap";
import { FaMinus, FaPlus, FaTrash } from 'react-icons/fa'
import UsuarioContext from "../context/UsuarioContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase-config";
import swal from "sweetalert";

function ProductoInventario(props) {

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
    const agregarInventario = async() => {
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

    // BORRAR INVENTARIO
    const borrarInventario = async() => {
        setLoading(true)
        try {
            await updateDoc(doc(db, "productos", props.p.id), {cantidad: 0})
            const setInfo = [...productos.filter(p => (p.id === props.p.id) ? [p.cantidad] = [0] : p)]
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


    const onEnter = (e) => {
        if (e.key === 'Enter'){
            agregarInventario(); 
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
                            <div className="pizchico"><img className="productoLista" src={props.p.imagen_thumbnail} alt="error" /></div>
                        </Col>
                        <Col>
                            <div className="t12">{props.p.nombre.toUpperCase()}</div>
                            <Row className="parchico">
                                <Col xs={8} md={6}>
                                    <InputGroup>
                                        <Button disabled={!cantidad || ((+props.p.cantidad - +cantidad) < 0)} className="botonInputAmarillo" onClick={restarInventario}>{loading ? <Spinner size="sm" /> : <FaMinus className="claseIconos" />}</Button>
                                        <Input type="number" className="letraEditarDatosInput" value={cantidad} placeholder={`# ${props.p.cantidad > 0 ? props.p.cantidad : 0}`} onChange={(e) => setCantidad(e.target.value)} 
                                            // onBlur={() => {agregarInventario()}}
                                            onKeyPress={(e) => onEnter(e)}
                                        />
                                        <Button disabled={!cantidad} className="botonInputAzul" onClick={agregarInventario}>{loading ? <Spinner size="sm" /> : <FaPlus className="claseIconos" />}</Button>
                                    </InputGroup>
                                </Col>
                                <Col>
                                    {(props.p.cantidad !== 0) && 
                                    <Button disabled={loading || (props.p.cantidad === 0)} onClick={() => swal({ 
                                        title: "¿Estás segur@?" , 
                                        text: "No podrás revertirlo!", 
                                        icon: "warning", 
                                        buttons: ["Cancelar", "Borrar"]
                                    }).then((res) => {if(res){borrarInventario()}})} className="botonInputRojo">{loading ? <Spinner size="sm" /> : <FaTrash className="claseIconos" />}</Button>}
                                    <span className="wbold azul pizchico">{props.p.propietario}</span></Col>
                            </Row>
                        </Col>
                    </Row>
                </div>
            </Card>
        </div>
    );
}

export default ProductoInventario;
