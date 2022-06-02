import React, { useState } from "react";
import { Card, Col } from 'reactstrap'


function ProductoAlmighty(props) {
    const [agregar, setAgregar] = useState(false)
    
    const irID = () => {
        setAgregar(!agregar)
    }

    
    const palabras = props.p.nombre.split(" ");
    const nombre = palabras.map(p => ((p[0] !== undefined && p[0]?.toUpperCase()) === false ? "" : (p[0] !== undefined && p[0]?.toUpperCase())) + (p !== undefined && p.substring(1).toLowerCase()) + " ")

    return (
        <Col className="pabmediano contenedor widthCardProveedorCol">
            <Card className={`pmediano claseCard widthCardProveedor centradoRelativo mouseSelectClick ${agregar && "fondoVerde"}`} onClick={() => irID()}>
                <div className="contenedor">
                    <img draggable="false" src={props.p.imagen_mediana} className="claseImagenCatalogo" alt="" />
                    <div className="gris centro parmediano">{nombre}</div>
                </div>
            </Card>
        </Col>
    );
}

export default ProductoAlmighty;
