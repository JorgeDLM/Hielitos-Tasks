import React from "react";
import { Card, Col } from 'reactstrap'


function ProductoCatalogo(props) {
    
    const palabras = props.p.nombre.split(" ");
    const nombre = palabras.map(p => ((p[0] !== undefined && p[0]?.toUpperCase()) === false ? "" : (p[0] !== undefined && p[0]?.toUpperCase())) + (p !== undefined && p.substring(1).toLowerCase()) + " ")

    return (
        <Col className="pabchico">
            <Card className="pmediano claseCard widthCardProveedor contenedor">
                <img src={props.p.imagen} className="claseImagenCatalogo" alt="" />
                <div className="gris centro parmediano">{nombre}</div>
                <div className="centro parmediano t20 bottom">${props.p.precio_venta}</div>
            </Card>
        </Col>
    );
}

export default ProductoCatalogo;
