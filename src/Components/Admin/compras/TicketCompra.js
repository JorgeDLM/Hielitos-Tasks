import React, { useContext } from "react";
import { Button, Card, Col, Row, Spinner } from "reactstrap";
import UsuarioContext from "../context/UsuarioContext";
import { FaTrash } from 'react-icons/fa'
import NumberFormat from "react-number-format";
import swal from "sweetalert";


function TicketCompras(props) {
    
    const {productosCompra, setProductosCompra, setLoading, loading, productos } = useContext(UsuarioContext)


    
    // // BORRAR PRODUCTO
    const borrarProducto = async(e) => {
        setLoading(true)
        try {
                if(e){
                    productosCompra.splice(props.i,1)
                    const dataProductos = [...productosCompra]
                    await setProductosCompra(dataProductos)
                    console.log("splice en 0")
                    localStorage.setItem('infoProductosCompras', JSON.stringify(productosCompra));
                }
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

    return (
        <>
            {loading ? <div className="centro pgrande"><Spinner className="gris" /></div> :
            <>
                    <div><span className="wbold t15 negro">{props.p.cantidad}</span> x {productos.find(prod => (prod.id === props.p.producto))?.nombre}
                    {' '}(<NumberFormat displayType={'text'} thousandSeparator={true} prefix={'$'} value={props.p.precio_compra} />/pza) 
                    </div>
                        <Row>
                            <Col><div className="wbold t14 azul parmuychico">TOTAL: <NumberFormat displayType={'text'} thousandSeparator={true} prefix={'$'} value={props.p.precio_compra * props.p.cantidad} /></div></Col>
                            <Col><Button onClick={(e) => borrarProducto(e)} className="botonRojoComentario"><FaTrash className="claseIconos t15" /></Button></Col>
                        </Row> 
                    <hr />

            </>}
        </>
    );
}

export default TicketCompras;
