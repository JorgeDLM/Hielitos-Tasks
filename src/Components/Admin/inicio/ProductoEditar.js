import React from "react";
import { Card, Col } from "reactstrap";
import { useNavigate } from "react-router-dom";


function ProductoEditar(props) {

    const navigate = useNavigate()
    const irID = () => {
        navigate(`/editar/${props.p.id}`)
    }

    return (
                    
        <Col className="pabmediano contenedor widthCardProveedorCol">
            <Card className="pmediano claseCard widthCardProveedor centradoRelativo" onClick={() => irID()}>
                <div className="contenedor">
                    <img src={props.p.imagen} className="claseImagenCatalogo" alt="error" />
                    <div className="gris centro parmediano">{props.p.nombre}</div>
                </div>
            </Card>
            <div className="centro parmediano t20 bottom">
                {props.p.precio_venta_ml && <span className="lineaEnmedio wbold">${props.p.precio_venta_ml}</span>} {props.p.precio_venta && <span className={props.p.precio_venta_ml && `pizmuychico`}>${props.p.precio_venta}</span>}
            </div>
        </Col>
    );
}

export default ProductoEditar;