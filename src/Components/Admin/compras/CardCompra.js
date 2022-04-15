import React, { useContext, useState } from "react";
import { Button, Card, Col, Input, Row, Modal, InputGroup, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Spinner } from "reactstrap";
import { FaPlus, FaMinus, FaCopy, FaEllipsisV, FaPen } from 'react-icons/fa'
import NumberFormat from "react-number-format";

import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase-config";

import UsuarioContext from "../context/UsuarioContext";
import swal from "sweetalert";

function CardCompra(props) {
    
    const { setLoading, compras, setCompras, loading, productosCache } = useContext(UsuarioContext)


    const [dropdown, setDropdown] = useState(false)
    const [areaComentario, setAreaComentario] = useState(false)
    const [comentario, setComentario] = useState("")
    const [estado, setEstado] = useState(props.c.estado)
    const [modal, setModal] = useState(false)


    const agregarEstado = async() => {
        if(!estado){
            swal({
                title: "Error",
                text: "Faltan de llenar campos, intente nuevamente.",
                icon: "error",
                button: "cerrar"
            });
        }
        setLoading(true)
        try {
            
            const dataC = {...props.c, estado: estado}
            const setearEstado = {...compras[props.i].estado = estado}
            console.log(setearEstado)
            
            await updateDoc(doc(db, "compras", props.c.id), dataC)
            setCompras([...compras])
            localStorage.setItem('infoCompras', JSON.stringify([...compras]))
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

    const agregarComentario = async() => {
        if(!comentario){
            swal({
                title: "Error",
                text: "Faltan de llenar campos, intente nuevamente.",
                icon: "error",
                button: "cerrar"
            });
        }
        setLoading(true)
        try {
            
            const dataC = {...props.c, comentario: comentario}
            const setearComentario = {...compras[props.i].comentario = comentario}
            console.log(setearComentario)
            
            await updateDoc(doc(db, "compras", props.c.id), dataC)
            setCompras([...compras])
            localStorage.setItem('infoCompras', JSON.stringify([...compras]))
            setLoading(false)
            setAreaComentario(false)
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

    const desactivarPublicacion = async() => {
        setLoading(true)
        try {  
            const dataC = {...props.c, activa: false}
            const setearActiva = {...compras[props.i].activa = false}
            console.log(setearActiva)
            
            await updateDoc(doc(db, "compras", props.c.id), dataC)
            setCompras([...compras])
            localStorage.setItem('infoCompras', JSON.stringify([...compras]))
            setLoading(false)
            setAreaComentario(false)
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

    return (
        <>
            <Card className="pmediano claseCard">
                <Row className="pmediano">
                    <Col xs={6}><span className="wbold">Fecha:</span> {new Date(props.c.timestamp).getDate()} de {meses[((new Date(props.c.timestamp).getMonth()))]} de {new Date(props.c.timestamp).getFullYear()}</Col>
                    <Col xs={5}>
                        <span className="wbold">Número de orden: </span>{props.c.numero_de_orden} <Button onClick={() => {navigator.clipboard.writeText(props.c.numero_de_orden)}} className="botonAzulComentario"><FaCopy className="claseIconos" /></Button>
                    </Col>
                    <Col xs={1}><div>
                        <Dropdown isOpen={dropdown} toggle={() => setDropdown(!dropdown)}>
                            <DropdownToggle data-toggle="dropdown" tag="span">
                                <FaEllipsisV style={{cursor:"pointer"}} onClick={() => {}} />
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem onClick={() => {desactivarPublicacion()}}>
                                    Eliminar publicación
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                        </div>
                    </Col>
                    <Col xs={6} className="parmuychico"><span className="wbold">Plataforma:</span> {props.c.plataforma}</Col>
                    <Col xs={6}><span className="wbold">Proveedor:</span> {props.c.proveedor}</Col>
                    <Col xs={6} className="parmuychico"><span className="wbold">Productos:</span> <Button className="wbold botonBlancoComentario" onClick={() => setModal(!modal)}>Ver ticket</Button> </Col>
                    <Col xs={6}><span className="wbold">Propietario:</span> {props.c.propietario}</Col>
                    <Col xs={6} className={`parmuychico`}>
                        <div className="wbold pdemuychico d-inline">Estado:</div> 
                        {loading ? <Spinner className="gris" size="sm" /> : <InputGroup className="d-inline">
                                <Input type="select" 
                                    className="letraChicaInput3 inputComentarios d-inline w50" 
                                    defaultValue={props.c.estado}
                                    onBlur={() => agregarEstado()}
                                    onChange={e => setEstado(e.target.value)}  >
                                        <option value="Por recibir">Por recibir</option>
                                        <option value="Entregado">Entregado</option>
                                        <option value="Entregado con problema">Entregado con problema</option>
                                        <option value="Por pagar">Por pagar</option>
                                </Input>
                            </InputGroup>}
                    </Col>
                    <Col xs={6} className={`parmuychico`}><span className="wbold">Creada por:</span> {props.c.usuario}</Col>
                    <Col xs={12} className={`${!props.c.falta_cobrar_ana && "pabchico"} parmuychico`}>
                        <span className="wbold">Comentario:</span><span className="gris"> {props.c.comentario ? props.c.comentario : ""}</span> <Button className="botonAmarilloComentario" 
                            onClick={() => setAreaComentario(!areaComentario)}>{props.c.comentario ? <FaPen className="tIconos t12"  /> : areaComentario ? <FaMinus className="tIconos t12" /> : <FaPlus className="tIconos t12" />}</Button>
                        {areaComentario && <div className="parmuychico">
                            {loading ? <Spinner className="gris" size="sm" /> : <Input type="textarea" 
                                    rows={3} 
                                    className="letraChicaInput3 inputComentarios" 
                                    defaultValue={props.c.comentario ? props.c.comentario : ""}
                                    placeholder={props.c.comentario ? props.c.comentario : "Comentario"} 
                                    onBlur={() => agregarComentario()}
                                    onChange={e => setComentario(e.target.value)}  />}
                        </div>}
                    </Col>
                    {props.c.falta_cobrar_ana && <Col xs={12} className="centro pabchico parchico"><span className="wbold rojo">Aún la debe Ana.</span></Col>}
                    <hr />
                    <Col xs={12} className="t20 centro"><span className="wbold">Monto:</span> <NumberFormat displayType={'text'} thousandSeparator={true} prefix={'$'} value={props.c.monto} /></Col>
                </Row>
            </Card>
                               
            {/* MODAL TICKET */}
            <Modal isOpen={modal} toggle={() => setModal(!modal)}>
                <div className="pgrande">
                    <div className="wbold t18">TICKET</div>
                    <hr />
                    <div className="gris">
                        {props.c.productos?.map((p, i) => <div key={i} className="t13 pabmuychico"><span className="wbold t15">{p.cantidad}</span> x {productosCache.filter(prod => prod.id ===  p.producto)[0]?.nombre}
                        <span className="pizmuychico">(<NumberFormat displayType={'text'} thousandSeparator={true} prefix={'$'} value={p.precio_compra} /> x pza)</span>
                        <span className="wbold pizmuychico">- <NumberFormat displayType={'text'} thousandSeparator={true} prefix={'$'} value={p.precio_compra * p.cantidad} /></span>
                        </div>)}
                    </div>
                    <div className="wbold derecha t20">Total: <NumberFormat displayType={'text'} thousandSeparator={true} prefix={'$'} value={props.c.monto} /></div>
                    <hr />
                    <div className="derecha"><Button onClick={() => setModal(!modal)} className="botonRojo">Cerrar</Button></div>
                </div>                                  
            </Modal>
        </>
    );
}

export default CardCompra;
