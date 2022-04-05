import React, { useEffect, useState } from "react";
import { Container, Card, Row, Col, Button } from "reactstrap";
import ModalProducto from './ModalProducto'
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase-config';
import ModalCategorias from "./ModalCategorias";


function Admin() {

    const [productos, setProductos] = useState([])
    const [ver, setVer] = useState(false)
    console.log(productos)
    
    // CARGAR CONTACTO
    const fetchProductos = async() => {
        const dataProductos =  await getDocs(collection(db, "productos"))
        const getDataProductos = dataProductos.docs.map((doc) => ({...doc.data()}))      
        setProductos(getDataProductos)
      }
      useEffect(() => {
        fetchProductos();
      }, [])

    return (
        <React.Fragment>
            <Container className="pabenorme">
                <div className="pargrande">
                    <ModalProducto />
                    <ModalCategorias />
                </div>
                <div>
                    <div className="pargrande">

                    {productos.map(p => (
                        <div className="parchico">
                            <Card className="claseCard">
                                <div className="pmediano">
                                    <Row>
                                        <Col xs={4}>
                                            <div className="pizchico"><img className="productoLista" src={p.imagen} alt="error" /></div>
                                        </Col>
                                        <Col>
                                            <div className="t20">{p.nombre.toUpperCase()}</div>
                                            <Row className="parchico">
                                                <Col>${p.precio_venta}</Col>
                                                {p.envio && <Col className="wbold verde">Envío gratis</Col>}
                                                <Col><span className="wbold azul">{p.propietario}</span></Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    {ver && <hr />}
                                </div>
                                {!ver && <Button onClick={() => setVer(!ver)} className="botonAmarillo w100">Ver más</Button>}
                                    {ver && <div className="pizchico pdechico pabchico">
                                        <div><span className="wbold azul">Temática:</span> {p.tematica}</div>
                                        <div><span className="wbold azul">Categoria:</span> {p.categoria}</div>
                                        <div><span className="wbold azul">Precio de compra:</span> {p.precio_compra}</div>
                                        <div><span className="wbold azul">Ganancia:</span> {p.precio_venta - p.precio_compra - (p.precio_venta >= 299 ? (p.envio === true ? 72 : 0) : (p.envio === true ? 100 : 0))}</div>
                                        <div><span className="wbold azul">Medidas:</span> {p.medidas}</div>
                                        <hr />
                                        <div><span className="wbold azul">Descripción:</span> {p.descripcion}</div>
                                        <div><span className="wbold azul">Inventario:</span> {p.cantidad}</div>
                                        <div><span className="wbold azul">Proveedor:</span> {p.proveedor}</div>
                                    </div>}
                                {ver && <Button onClick={() => setVer(!ver)} className="botonAmarillo w100">Ver menos</Button>}
                            </Card>
                        </div>
                    ))}
                    </div>
                </div>
            </Container>
        </React.Fragment>
    );
}

export default Admin;
