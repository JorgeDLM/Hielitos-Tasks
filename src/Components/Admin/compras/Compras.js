import React, { useContext, useState } from "react";
import { Button, Card, Col, Container, Input, Row, Modal, InputGroup } from "reactstrap";
import ProductoCompras from "./ProductoCompras";
import Regla3 from "./Regla3";
import Fuse from 'fuse.js'
import { FaExclamationTriangle, FaPlus, FaMinus, FaDollarSign, FaCopy } from 'react-icons/fa'
import NumberFormat from "react-number-format";
import TicketCompraActual from "./TicketCompraActual";

import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../../firebase-config';

import UsuarioContext from "../context/UsuarioContext";
import swal from "sweetalert";
import ModalTicketCompra from "./ModalTicketCompra";
import Comentario from "./Comentario";

function Compras() {
    
    const {productos, usuario, productosCompra, setLoading, compras, setCompras, setProductosCompra} = useContext(UsuarioContext)

    const [query, setQuery] = useState('')
    const [nueva, setNueva] = useState(false)
    const [regla3, setRegla3] = useState(false)

    const [proveedor, setProveedor] = useState("")
    const [numero_de_orden, setNumeroOrden] = useState("")
    const [plataforma, setPlataforma] = useState("Aliexpress")
    const [propietario, setPropietario] = useState("Jorge")
    const [falta_cobrar_ana, setFaltaCobrarAna] = useState("")

    const [comentario, setComentario] = useState("")
    
    const [modal, setModal] = useState(false)


    const fuse = new Fuse(productos, {
        keys: [{name:"nombre", weight: 0.4}, {name:"categoria", weight: 0.25}, {name:"sub-categoria", weight: 0.25}, {name:"propietario", weight: 0.1}],
        threshold: 0.5,
        includeScore: true,
        shouldSort: true,
      })
      
    const busqueda = fuse.search(query) 
    const productosFuse = query ? busqueda.map(resultado => resultado.item) : productos.sort((a, b) => (a.nombre > b.nombre) ? 1 : -1)

    const total = (productosCompra.length >= 1) && productosCompra?.map(m => +m.cantidad * +m.precio_compra)?.reduce((total, entrada) => (total += entrada))

    const productosValidos = (productosCompra.length >= 1) 
    const dataIncompleta = !productosValidos || (proveedor === "") || (numero_de_orden === "") || (plataforma === "") || (propietario === "")
    console.log(dataIncompleta)

    const clearInputs = () => {
        setProveedor("")
        setNumeroOrden("")
        setPlataforma("Aliexpress")
        setPropietario("Jorge")
        setFaltaCobrarAna("")
    }

    // GENERAR COMPRA
    const generarCompra = async() => {
        if(dataIncompleta){
            swal({
                title: "Error",
                text: "Faltan de llenar campos, intente nuevamente.",
                icon: "error",
                button: "cerrar"
            });
        }
        setLoading(true)
        try {
            const data = {
                usuario: `${usuario?.nombre} ${usuario?.apellidos}`,
                productos: productosCompra, 
                estado: "Por recibir", 
                proveedor: proveedor ? proveedor : "", 
                numero_de_orden: numero_de_orden ? numero_de_orden : "", 
                plataforma: plataforma ? plataforma : "Aliexpress", 
                monto: total, 
                propietario: propietario,
                falta_cobrar_ana: falta_cobrar_ana ? falta_cobrar_ana : false,
                comentario: "",
                timestamp: new Date().getTime(),
            }
            await addDoc(collection(db, "compras"), data)
            setProductosCompra([])
            setCompras([...compras, data])
            localStorage.setItem('infoCompras', JSON.stringify(data));
            localStorage.removeItem('infoProductosCompras')
            clearInputs("")
            setModal(false)
            setLoading(false)
            swal({
                title: "Felicidades",
                text: "Compra creada con exito",
                icon: "success",
                button: "cerrar"
            });
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

    const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre" ]

    console.log(comentario)

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
                            {productosValidos && <div className="w100"><Button className="botonNegro w100" onClick={() => setModal(!modal)} >Generar compra</Button></div>}
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
                                <TicketCompraActual p={p} i={i} />
                            </div>)}
                                <div className="wbold t20 centro">TOTAL: 
                                    <span className="pizchico"><NumberFormat displayType={'text'} thousandSeparator={true} prefix={'$'} value={total} /></span>
                                </div>
                        </Card>
                    </Col>}
                </Row>}

                {/* COMPRAS */}
               <div className="pabenorme">
                    <div className="wbold pargrande t20">Compras:</div>
                    {compras.length >= 1 && compras?.map((c, i) => <div key={i} className="parchico">
                        <Card className="pmediano claseCard">
                            <Row className="pmediano">
                                <Col xs={6}>
                                    <span className="wbold">Número de orden: </span>{c.numero_de_orden} <Button onClick={() => {navigator.clipboard.writeText(c.numero_de_orden)}} className="botonAzulComentario"><FaCopy className="claseIconos" /></Button>
                                </Col>
                                <Col xs={6}><span className="wbold">Fecha:</span> {new Date(c.timestamp).getDay()} de {meses[((new Date(c.timestamp).getMonth()) - 1)]} de {new Date(c.timestamp).getFullYear()}</Col>
                                <Col xs={6}><span className="wbold">Propietario:</span> {usuario?.nombre} {usuario?.apellidos}</Col>
                                <Col xs={6}><span className="wbold">Proveedor:</span> {c.proveedor}</Col>
                                <Col xs={6} className="parmuychico"><span className="wbold">Plataforma:</span> {c.plataforma}</Col>
                                <Col xs={6} className="parmuychico"><span className="wbold">Productos:</span> <ModalTicketCompra c={c} /> </Col>
                                <Col xs={6} className={`parmuychico`}><span className="wbold">Estado:</span> <span className={`wbold ${c.estado === "Por recibir" ? "azul" : c.estado === "Cancelada" ? "negro" : c.estado === "Recibida" ? "verde" : "amarillo"}`}>{c.estado}</span></Col>
                                <Col xs={6} className={`parmuychico`}><span className="wbold">Creada por:</span> {c.usuario}</Col>
                                <Col xs={12} className={`${!c.falta_cobrar_ana && "pabchico"} parmuychico`}>
                                    <Comentario setComentario={(e) => setComentario(e)} c={c} />
                                </Col>
                                {c.falta_cobrar_ana && <Col xs={12} className="centro pabchico parchico"><span className="wbold rojo">Aún la debe Ana.</span></Col>}
                                <hr />
                                <Col xs={12} className="t20 centro"><span className="wbold">Monto:</span> <NumberFormat displayType={'text'} thousandSeparator={true} prefix={'$'} value={c.monto} /></Col>
                            </Row>
                        </Card>
                    </div>)}
               </div>
                {/* MODAL COMPRA */}
                <Modal isOpen={modal} toggle={() => setModal(!modal)}>
                    <Row className="pmediano">
                        <Col xs={6}>
                            <div className="wbold">Plataforma:</div>
                            <Input type="text" className="letraChicaInput3 inputComentarios" defaultValue={"Aliexpress"} value={plataforma} placeholder="Plataforma"
                                onChange={e => setPlataforma(e.target.value)} invalid={plataforma === ""} />
                        </Col>
                        <Col xs={6}>  
                            <div className="wbold">Proveedor:</div>
                            <Input type="text" className="letraChicaInput3 inputComentarios" value={proveedor} placeholder="Proveedor"
                                onChange={e => setProveedor(e.target.value)} invalid={proveedor === ""} />
                        </Col>
                        <Col xs={6}>
                        <div className="wbold parchico">Número de orden:</div>
                            <Input type="number" className="letraChicaInput3 inputComentarios" value={numero_de_orden} placeholder="Número de orden"
                                onChange={e => setNumeroOrden(e.target.value)} invalid={numero_de_orden === ""} /></Col>
                        <Col xs={6}>
                            <div className="wbold parchico">Propietario:</div>
                            <InputGroup>
                                <Input type="select" className="letraChicaInput3 inputComentarios" value={propietario} onChange={e => setPropietario(e.target.value)} invalid={propietario === ""} >
                                    <option value="Jorge">Jorge</option>
                                    <option value="Ana">Ana</option>
                                </Input>
                            </InputGroup>
                        </Col>
                        {propietario === "Ana" && <Col xs={{size:6, offset: 3}}>
                            <div className="wbold parchico">Falta cobrarle a Ana:</div>
                                <Input type="select" className="letraChicaInput3 inputComentarios" value={falta_cobrar_ana} onChange={e => setFaltaCobrarAna(e.target.value)} invalid={falta_cobrar_ana === ""} >
                                    <option value="">Seleccione:</option>
                                    <option value="si">Sí</option>
                                    <option value="no">No</option>
                                </Input>
                        </Col>}
                        <Col xs={12} className="parmediano pabchico centro">
                            <Button onClick={() => generarCompra()} disabled={dataIncompleta} className="w100 botonNegro">Generar compra</Button>
                        </Col>
                    </Row>                                    
                </Modal>
            </Container>

        </React.Fragment>
    );
}

export default Compras;
