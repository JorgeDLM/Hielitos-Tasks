import React, { useState } from "react";
import { Button, Card, Col, Input, InputGroup, Row } from "reactstrap";
import { FaDollarSign, FaHashtag } from 'react-icons/fa'


function Compras() {

    const [total, setTotal] = useState("")
    const [cantidad, setCantidad] = useState("")
    const [dollar, setDollar] = useState("")
    const [isDollar, setIsDollar] = useState(true)
    const [subTotal, setSubTotal] = useState("")
    const [precioItem, setPrecioItem] = useState("")


    const envio = total - subTotal
    const proporcionEnvio = ((envio)/subTotal) + 1
    const precioUnidad = precioItem * proporcionEnvio

    if(dollar && isDollar){
        setIsDollar(false)
    }
    if(!dollar && !isDollar){
        setIsDollar(true)
    }

    return (
        <Card>
            <Row className="parmediano pizchico pdechico">
                <Col xs={12} className="pabchico t20 centro">
                    <Card className="pmediano"><span className="wbold">Precio por unidad:</span>  ${!isDollar ? ((precioUnidad * dollar)/(cantidad ? cantidad : 1)).toFixed(2) : (precioUnidad/(cantidad ? cantidad : 1)).toFixed(2)} {isDollar ? "dolares" : "pesos"}</Card>
                </Col>
                <Col xs={6} className="pabchico"><div className="wbold">Subtotal</div><InputGroup><Button className="botonGris"><FaDollarSign className="tIconos" /></Button>
                    <Input type="number" placeholder="Subtotal" onChange={(e) => setSubTotal(e.target.value)} /></InputGroup>
                </Col>
                <Col xs={6} className="pabchico"><div className="wbold">Total</div><InputGroup><Button className="botonNegro"><FaDollarSign className="tIconos" /></Button>
                    <Input type="number" placeholder="Total" onChange={(e) => setTotal(e.target.value)} /></InputGroup>
                </Col>
                <Col xs={6} className="pabchico"><div className="wbold">Precio item</div><InputGroup><Button className="botonGris"><FaDollarSign className="tIconos" /></Button>
                    <Input type="number" placeholder="Precio item" onChange={(e) => setPrecioItem(e.target.value)} /></InputGroup>
                </Col>
                <Col xs={6} className="pabchico"><div className="wbold">Precio dollar (opcional)</div><InputGroup><Button className="botonVerde"><FaDollarSign className="tIconos" /></Button>
                    <Input type="number" placeholder="Dollar" onChange={(e) => setDollar(e.target.value)} /></InputGroup>
                </Col>
                <Col xs={6} className="pabchico"><div className="wbold">Cantidad (opcional)</div><InputGroup><Button className="botonRojo"><FaHashtag className="tIconos" /></Button>
                    <Input type="number" placeholder="Cantidad" onChange={(e) => setCantidad(e.target.value)} /></InputGroup>
                </Col>
            </Row>
        </Card>
    );
}

export default Compras;
