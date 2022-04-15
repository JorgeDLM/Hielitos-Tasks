import React, { useContext, useState } from "react";
import { Button, Card, Col, Container, Input, Row, Modal, InputGroup } from "reactstrap";
import Regla3 from "./Regla3";
import { FaPlus, FaMinus, FaDollarSign } from 'react-icons/fa'
import NumberFormat from "react-number-format";
import TicketCompraActual from "./TicketCompraActual";

import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../../firebase-config';

import UsuarioContext from "../context/UsuarioContext";
import swal from "sweetalert";
import CardCompra from "./CardCompra";
import Buscador from "../../buscador/Buscador";

function Compras() {
    
    const {usuario, productosCompra, setLoading, compras, setCompras, setProductosCompra, loading} = useContext(UsuarioContext)

    const [nueva, setNueva] = useState(!loading ? (!compras?.length ? true : false) : false)
    const [regla3, setRegla3] = useState(false)

    const [proveedor, setProveedor] = useState("")
    const [numero_de_orden, setNumeroOrden] = useState("")
    const [plataforma, setPlataforma] = useState("Aliexpress")
    const [propietario, setPropietario] = useState("Jorge")
    const [falta_cobrar_ana, setFaltaCobrarAna] = useState("")

    
    const [modal, setModal] = useState(false)

   
    const total = (productosCompra.length >= 1) && productosCompra?.map(m => +m.cantidad * +m.precio_compra)?.reduce((total, entrada) => (total += entrada))
    const cantidadTotal = (productosCompra.length >= 1) && productosCompra?.map(m => +m.cantidad)?.reduce((total, entrada) => (total += entrada))

    const productosValidos = (productosCompra.length >= 1) 
    const dataIncompleta = !productosValidos || (proveedor === "") || (numero_de_orden === "") || (plataforma === "") || (propietario === "")

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
                activa: true,
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
   


    return (
        <React.Fragment>
            <Container className="pabenorme">
                {/* REGLA 3 */}
                <div className="pargrande w100"><Button className="botonAmarillo w100" onClick={() => setRegla3(!regla3)}><FaDollarSign className="tIconos" /></Button></div>
                {regla3 && <Regla3 />}

                {/* PRODUCTOS */}
                <div className="pargrande w100"><Button className="botonAzul w100" onClick={() => setNueva(!nueva)}>{nueva ? <FaMinus className="tIconos" /> : <FaPlus className="tIconos" />}</Button></div>
                {nueva && <>
                    <Row>
                        <Col>
                    
                            <div className="pargrande">
                                <Buscador compras />
                            </div>
                        </Col>
                        {productosCompra.length >= 1 && <Col xs={4} className="pargrande">
                            <Card className="pmediano">
                                <div className="wbold">Compra:</div>
                                <div className={productosCompra?.length >= 7 && "overflowTicket"}>
                                    {productosCompra.sort((a, b) => (a.producto > b.producto) ? 1 : -1).map((p, i) => <div key={i} className="gris t12 parchico">
                                        <TicketCompraActual p={p} i={i} />
                                    </div>)}
                                </div>
                                    <div className="wbold t20 centro">TOTAL: 
                                        <span className="pizchico"><NumberFormat displayType={'text'} thousandSeparator={true} prefix={'$'} value={total} /> <span className="gris t12 wnormal"> - {cantidadTotal} ud. - (${(total/cantidadTotal).toFixed(0)}/pza)</span> </span>
                                    </div>
                            </Card>
                        </Col>}
                    </Row>
                    <hr />
                </>}

                {/* COMPRAS */}
               {compras?.filter(c => c.activa)?.length >= 1 && <div className="pabenorme">
                    <div className="wbold pargrande t20">Compras:</div>
                    <div className="overflowCompras">
                        {compras.length >= 1 && compras?.filter(c => c.activa)?.sort((a,b) => a.timestamp > b.timestamp)?.map((c, i) => <div key={i} className="parchico">
                            <CardCompra key={i} c={c} i={i} />
                        </div>)}
                    </div>
               </div>}
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
