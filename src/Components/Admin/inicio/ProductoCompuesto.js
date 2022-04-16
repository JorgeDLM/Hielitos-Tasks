import React, { useState } from "react";
import { Input, Row, Col, InputGroup, Button } from "reactstrap"
import { FaTrash } from 'react-icons/fa'

function ProductoCompuesto(props) {

    const index = props.compuesto?.findIndex(p => p?.producto === props.p?.id)
    const [cantidad, setCantidad] = useState("")
    // const [placeholder] = useState((props.compuesto[index]?.cantidad && props.compuesto[index]?.cantidad) ? props.compuesto[index].cantidad : "")
    const [busqueda, setBusqueda] = useState(false)

    const setProducto = async () => {
        
        if(cantidad){

                // SI NO EXISTE
                if (!(props.compuesto.filter(c  => c.producto === props.p.id).length)){
                    await props.setCompuesto([...props.compuesto, {producto: props.p.id, cantidad: cantidad}])
                    setCantidad("")
                console.log("1")
            }
            
            // SI EXISTE Y CANTIDAD CAMBIA
            if ((props.compuesto.filter(c  => c.producto === props.p.id).length) && cantidad){
                await props.compuesto.splice(index, 1)
                await props.setCompuesto([...props.compuesto, {producto: props.p.id, cantidad: cantidad}])
                setCantidad("")
                console.log("2")
            }
            
        }
        // SI EXISTE Y CANTIDAD CAMBIA A 0
        if ((props.compuesto.filter(c  => c.producto === props.p.id).length && !cantidad)){
            await props.compuesto.splice(index, 1)
            await props.setCompuesto([...props.compuesto])
            setCantidad("")
            console.log("3")
        }
        
    }

    const borrarProducto = async() => {
        await props.compuesto.splice(index, 1)
        await props.setCompuesto([...props.compuesto])
        setCantidad("")
        console.log("3")
    }
     
    if (props.cambio >= 1 && !busqueda){
        setBusqueda(true)
        setCantidad("")
    }
    
    if (props.cambio === 0 && busqueda){
        setBusqueda(false)
        setCantidad("")
    }
    const productoCompIndex = props.compuesto.findIndex(c => c.producto === props.p?.id)
    const placeholder = props.compuesto[productoCompIndex]?.cantidad ? props.compuesto[productoCompIndex]?.cantidad : "Cantidad"

    return (
        <React.Fragment>
            <Row>
                <Col xs={3}>
                    <InputGroup>
                        <Input type="number" className="inputNumeroSF" 
                            placeholder={placeholder} 
                            value={cantidad}
                            onBlur={() => setProducto()} 
                            onChange={(e) => {setCantidad(e.target.value)}} />
                            {(props.compuesto.filter(c  => c.producto === props.p.id).length >= 1) && <Button onClick={borrarProducto} className="botonRojo"><FaTrash className="claseIconos" /></Button>}
                    </InputGroup>
                </Col>
                <Col>{props.p?.nombre} - ${props.p?.precio_compra}</Col>
            </Row>
            <hr className="sinpym" />
        </React.Fragment>
    );
}

export default ProductoCompuesto;
