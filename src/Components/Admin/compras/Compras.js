import React, { useContext, useState } from "react";
import { Button, Card, Col, Container, Input, Row, Modal } from "reactstrap";
import ProductoCompras from "./ProductoCompras";
import Regla3 from "./Regla3";
import Fuse from 'fuse.js'
import { FaExclamationTriangle, FaPlus, FaMinus, FaDollarSign } from 'react-icons/fa'
import NumberFormat from "react-number-format";
import TicketCompras from "./TicketCompra";

import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../../firebase-config';

import UsuarioContext from "../context/UsuarioContext";
import swal from "sweetalert";

function Compras() {
    
    const {productos, usuario, productosCompra, setLoading, setCompras, setProductosCompra} = useContext(UsuarioContext)

    console.log(productos)

    const [query, setQuery] = useState('')
    const [nueva, setNueva] = useState(true)
    const [regla3, setRegla3] = useState(false)

    const [proveedor, setProveedor] = useState("")
    const [numero_de_orden, setNumeroOrden] = useState("")
    const [plataforma, setPlataforma] = useState("")
    
    const [modal, setModal] = useState(true)


    const fuse = new Fuse(productos, {
        keys: [{name:"nombre", weight: 0.4}, {name:"categoria", weight: 0.25}, {name:"sub-categoria", weight: 0.25}, {name:"propietario", weight: 0.1}],
        threshold: 0.5,
        includeScore: true,
        shouldSort: true,
      })
      
    const busqueda = fuse.search(query) 
    const productosFuse = query ? busqueda.map(resultado => resultado.item) : productos.sort((a, b) => (a.nombre > b.nombre) ? 1 : -1)

    const total = (productosCompra.length >= 1) && productosCompra?.map(m => +m.cantidad * +m.precio_compra)?.reduce((total, entrada) => (total += entrada))


    // GENERAR COMPRA
    const generarCompra = async() => {
        setLoading(true)
        try {
            const data = {
                usuario: `${usuario?.nombre} ${usuario?.apellidos}`,
                productos: productosCompra, 
                estado: "Por recibi", 
                proveedor: proveedor ? proveedor : "", 
                numero_de_orden: numero_de_orden ? numero_de_orden : "", 
                plataforma: plataforma ? plataforma : "Aliexpress", 
                monto: total, 
                propietario: usuario?.nombre, 
                timestamp: new Date().getTime(),
            }
            await addDoc(collection(db, "compras"), data)
            setProductosCompra([])
            setCompras([...data, data])
            localStorage.setItem('infoCompras', JSON.stringify(data));
            localStorage.removeItem('infoProductosCompras')
            // setCantidad("")
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
        <React.Fragment>
            <Container className="pabenorme">
                {/* REGLA 3 */}
                <div className="pargrande w100"><Button className="botonAmarillo w100" onClick={() => setRegla3(!regla3)}><FaDollarSign className="tIconos" /></Button></div>
                {regla3 && <Regla3 />}

                {/* PRODUCTOS */}
                <div className="pargrande w100"><Button className="botonAzul w100" onClick={() => setNueva(!nueva)}>{nueva ? <FaMinus className="tIconos" /> : <FaPlus className="tIconos" />}</Button></div>
                {nueva && <Row>
                    <Col>

                        <div className="pargrande">
                            <div className="pabmediano"><Input type="search" placeholder="Buscar producto" input={query} onChange={e => {setQuery(e.target.value)}} /></div>
                            <div className="w100"><Button className="botonNegro w100" onClick={() => setModal(!modal)} >Generar compra</Button></div>
                                {productosFuse.sort((a, b) => (a.nombre > b.nombre) ? 1 : -1).map((p, i) => 
                                    <ProductoCompras key={i} p={p}  cambio={query.length} />
                                )}
                                {productosFuse.sort((a, b) => (a.nombre > b.nombre) ? 1 : -1).length <= 0 && 
                                    (<div className="pizchico pabmediano  parchico"><FaExclamationTriangle className="amarillo tIconos" /> No encontramos resultados para tu busqueda.</div> 
                                )}
                        </div>
                    </Col>
                    {productosCompra.length >= 1 && <Col xs={4} className="pargrande">
                        <Card className="pmediano">
                            <div className="wbold">Compra:</div>
                            {productosCompra.sort((a, b) => (a.producto > b.producto) ? 1 : -1).map((p, i) => <div key={i} className="gris t12 parchico">
                                <TicketCompras p={p} i={i} />
                            </div>)}
                                <div className="wbold t20 centro">TOTAL: 
                                    <span className="pizchico"><NumberFormat displayType={'text'} thousandSeparator={true} prefix={'$'} value={total} /></span>
                                </div>
                        </Card>
                    </Col>}
                </Row>}

                {/* COMPRAS */}
                <div className="wbold pargrande pabenorme t20">Compras:</div>
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

                {/* MODAL */}
                <Modal isOpen={modal} toggle={() => setModal(!modal)}>
                    usuario, productos, estado, proveedor, numero_de_orden, plataforma, monto, propietario, timestamp
                </Modal>
        </React.Fragment>
    );
}

export default Compras;
