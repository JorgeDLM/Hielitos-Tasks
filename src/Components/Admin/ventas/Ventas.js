import React, { useContext, useState } from "react";
import { Button, Card, Col, Container, Input, Row } from "reactstrap";
import ProductoVentas from "./ProductoVentas";
import UsuarioContext from "../context/UsuarioContext";
import Fuse from 'fuse.js'
import { FaExclamationTriangle, FaPlus, FaMinus } from 'react-icons/fa'
import NumberFormat from "react-number-format";


function Ventas() {
    
    const {productos, usuario, productosVenta} = useContext(UsuarioContext)


    const [query, setQuery] = useState('')
    const [nueva, setNueva] = useState(true)

    const fuse = new Fuse(productos, {
        keys: [{name:"nombre", weight: 0.4}, {name:"categoria", weight: 0.25}, {name:"sub-categoria", weight: 0.25}, {name:"propietario", weight: 0.1}],
        threshold: 0.5,
        includeScore: true,
        shouldSort: true,
      })
      
    const busqueda = fuse.search(query) 
    const productosFuse = query ? busqueda.map(resultado => resultado.item) : productos.sort((a, b) => (a.nombre > b.nombre) ? 1 : -1)

    const total = (productosVenta.length >= 1) && productosVenta?.map(m => +m.cantidad * +m.precio_venta_ml)?.reduce((total, entrada) => (total += entrada))

    return (
        <React.Fragment>
            <Container className="pabenorme">

                {/* PRODUCTOS */}
                <div className="pargrande w100"><Button className="botonAzul w100" onClick={() => setNueva(!nueva)}>{nueva ? <FaMinus className="tIconos" /> : <FaPlus className="tIconos" />}</Button></div>
                {nueva && <Row>
                    <Col>

                        <div className="pargrande">
                            <div className="pabmediano"><Input type="search" placeholder="Buscar producto" input={query} onChange={e => {setQuery(e.target.value)}} /></div>
                            <div className="w100"><Button className="botonNegro w100" >Generar venta</Button></div>
                                {productosFuse.sort((a, b) => (a.nombre > b.nombre) ? 1 : -1).map((p, i) => 
                                    <ProductoVentas key={i} p={p}  cambio={query.length} />
                                )}
                                {productosFuse.sort((a, b) => (a.nombre > b.nombre) ? 1 : -1).length <= 0 && 
                                    (<div className="pizchico pabmediano  parchico"><FaExclamationTriangle className="amarillo tIconos" /> No encontramos resultados para tu busqueda.</div> 
                                )}
                        </div>
                    </Col>
                    {productosVenta.length >= 1 && <Col xs={4} className="pargrande">
                        <Card className="pmediano">
                            <div className="wbold">Venta:</div>
                            {productosVenta.sort((a, b) => (a.producto > b.producto) ? 1 : -1).map((p, i) => <div key={i} className="gris t12 parchico">
                                <div><span className="wbold t15 negro">{p.cantidad}</span> x {productos.find(prod => (prod.id === p.producto))?.nombre}
                                {' '}(<NumberFormat displayType={'text'} thousandSeparator={true} prefix={'$'} value={p.precio_venta_ml} />/pza) 
                                <div className="wbold t14 azul parmuychico">TOTAL: <NumberFormat displayType={'text'} thousandSeparator={true} prefix={'$'} value={p.precio_venta_ml * p.cantidad} /></div></div>
                                <hr />
                            </div>)}
                                <div className="wbold t20 centro">TOTAL: 
                                    <span className="pizchico"><NumberFormat displayType={'text'} thousandSeparator={true} prefix={'$'} value={total} /></span>
                                </div>
                        </Card>
                    </Col>}
                </Row>}

                {/* VENTAS */}
                <div className="wbold pargrande pabenorme t20">Ventas:</div>
                <Card className="pmediano">
                    <Row>
                        <Col xs={6}>Fecha: timestamp</Col>
                        <Col xs={6}>Propietario {usuario?.nombre} {usuario?.apellidos}</Col>
                        <Col xs={6}>Proveedor</Col>
                        <Col xs={6}>plataforma</Col>
                        <Col xs={6}>articulos (prod ID, cantidad) </Col>
                        <Col xs={6}>monto</Col>
                        <Col xs={6}>#orden</Col>
                        <Col xs={6}>estado (entregada, en camino, por pagar, cancelada)</Col>
                    </Row>
                </Card>
            </Container>
        </React.Fragment>
    );
}

export default Ventas;
