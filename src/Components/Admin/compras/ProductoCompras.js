import React, { useContext, useEffect, useState } from "react";
import { Card, Row, Col, Button, Input, InputGroup, Spinner } from "reactstrap";
import UsuarioContext from "../context/UsuarioContext";
import { FaTrash } from 'react-icons/fa'
import swal from "sweetalert";

function ProductoCompras(props) {

    const {productosCompra, setProductosCompra, setLoading, loading, usuario } = useContext(UsuarioContext)

    const [cantidad, setCantidad] = useState("")
    const [precio_compra, setPrecioCompra] = useState(props.p.precio_compra)
    const [busqueda, setBusqueda] = useState(false)

    if (props.cambio >= 1 && !busqueda){
        setBusqueda(true)
        setCantidad("")
    }
    
    if (props.cambio === 0 && busqueda){
        setBusqueda(false)
        setCantidad("")
    }
    useEffect(() => {
        localStorage.setItem('infoProductosCompras', JSON.stringify(productosCompra));
        // setProductosCompra(productosCompra);
    }, [cantidad, productosCompra, setProductosCompra])
    

    // AGREGAR INVENTARIO
    const agregarProductosCompra = async(e) => {
        setLoading(true)
        try {
            const data = [{ producto: props.p.id, cantidad: cantidad, precio_compra: precio_compra }]
            const index = productosCompra.findIndex(p => p.producto === props.p.id)

                if(e){
                    productosCompra.splice(index,1)
                    const dataProductos = [...productosCompra]
                    await setProductosCompra(dataProductos)
                    localStorage.setItem('infoProductosCompras', JSON.stringify(productosCompra));
                }
            
                if (index !== -1 && cantidad === "0"){
                    productosCompra.splice(index,1)
                    const dataProductos = [...productosCompra]
                    await setProductosCompra(dataProductos)
                    localStorage.setItem('infoProductosCompras', JSON.stringify(productosCompra));
                }
                if (index !== -1 && cantidad > "0"){
                    productosCompra.splice(index,1)
                    const dataProductos = [...productosCompra, ...data]
                    await setProductosCompra(dataProductos)
                    localStorage.setItem('infoProductosCompras', JSON.stringify(productosCompra));
                }
                if (index === -1 && cantidad > "0"){
                    const dataProductos = [...productosCompra, ...data]
                    await setProductosCompra(dataProductos)
                    localStorage.setItem('infoProductosCompras', JSON.stringify(productosCompra));
                }
            
            
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
 

    // LOS PRODUCTOS NO SE AGREGARAN A INVENTARIO SINO HASTA QUE LA COMPRA SEA MARCADA COMO ENTREGADA


    const onEnter = (e) => {
        if (e.key === 'Enter'){
            agregarProductosCompra(); 
        }
        if (e.key === '+' || e.key === '-' || e.key === 'e' || e.key === 'E'){
            e.preventDefault();
        }
    }

    const prevDefault = (e) => {
        if (e.key === '+' || e.key === '-' || e.key === 'e' || e.key === 'E'){
            e.preventDefault();
        }
    }

    const productoCantidad =  productosCompra.find(p => (p.producto === props.p.id))?.cantidad
    
    useEffect(() => {
        const productoPrecioCompra =  productosCompra.find(p => (p.producto === props.p.id))?.precio_compra
        if (productoPrecioCompra){
            setPrecioCompra(productoPrecioCompra)
        }
    }, [productosCompra, props.p.id])

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
                                        <Button className="botonAzul">$</Button>
                                        <Input type="number" className="letraEditarDatosInput" 
                                            placeholder={`$${props.p.precio_compra}`} 
                                            onChange={(e) => setPrecioCompra(e.target.value)} 
                                            min={0}
                                            onKeyPress={(e) => prevDefault(e)}
                                        />
                                        {loading && <Button className="botonAzul"><Spinner size="sm" /></Button>}
                                    </InputGroup>
                                    <InputGroup>
                                        <Input type="number" className="letraEditarDatosInput" value={cantidad} 
                                            placeholder={`# ${productoCantidad > 0 ? productoCantidad : 0}`} 
                                            onChange={(e) => setCantidad(e.target.value)} 
                                            min={0}
                                            onBlur={() => {if(cantidad !== ""){agregarProductosCompra()}}}
                                            onKeyPress={(e) => onEnter(e)}
                                        />
                                        {productoCantidad > 0 && <Button onClick={(e) => agregarProductosCompra(e)} className="botonRojo"><FaTrash className="claseIconos t13" /></Button>}
                                        {loading && <Button className="botonAzul"><Spinner size="sm" /></Button>}
                                    </InputGroup>
                                </Col>
                                <Col>
                                    Comprado por: <span className="wbold azul pizchico">{usuario?.nombre} {usuario?.apellidos}</span>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </div>
            </Card>
        </div>
    );
}

export default ProductoCompras;
