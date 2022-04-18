import React from "react";
import { Card, Col } from "reactstrap";
import { Link } from "react-router-dom";


function ProductoEditar(props) {

    // const irID = () => {
    //     window.scrollTo(0, 0); 
    // }    
    const palabras = props.p.nombre.split(" ");
    const nombre = palabras.map(p => ((p[0] !== undefined && p[0]?.toUpperCase()) === false ? "" : (p[0] !== undefined && p[0]?.toUpperCase())) + (p !== undefined && p.substring(1).toLowerCase()) + " ")

    return (
                    
        <Col className="pabmediano contenedor widthCardProveedorCol">
            <div className="widthCardProveedor centradoRelativo contenedor">
                <Link 
                    to={`/admin/editar/${props.p.id}`} 
                    target="_blank" 
                    className="linkSF fondoRojo">
                    <Card className={`pmediano claseCard widthCardProveedor centradoRelativo mouseSelectClick ${props.p.propietario === "Ana y Jorge" && "fondoAzulClaro"} ${props.p.propietario === "Ana" && "fondoRojoClaro"}`}>
                        <div className="contenedor">
                            <img src={props.p.imagen_thumbnail} className="claseImagenCatalogo" alt="error" />
                            <div className="gris centro parmediano">{nombre}</div>
                        </div>
                    </Card>
                </Link>
            </div>
            <div className="centro parmediano t20 bottom">
                {props.p.precio_venta_ml && <span className="lineaEnmedio wbold">${props.p.precio_venta_ml}</span>} {props.p.precio_venta && <span className={props.p.precio_venta_ml && `pizmuychico`}>${props.p.precio_venta}</span>}
            </div>
        </Col>
    );
}

export default ProductoEditar;
