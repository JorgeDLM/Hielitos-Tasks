import React, { useContext, useEffect, useState } from "react";
import { Container, Card, Row, Col, Button, Input, Modal } from "reactstrap";
import { FaPen, FaPlus } from 'react-icons/fa'
import UsuarioContext from "../context/UsuarioContext";
import swal from "sweetalert";
import { addDoc, collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "../../../firebase-config";
import NumberFormat from "react-number-format";


function Contabilidad() {
    const {usuario} = useContext(UsuarioContext)

    const [areaEditar, setAreaEditar] = useState(false)
    const [nombre, setNombre] = useState("")
    const [costo_unitario, setCostoUnitario] = useState("")
    const [gasto_total, setGastoTotal] = useState("")
    const [unidad, setUnidad] = useState("")
    const [cantidad, setCantidad] = useState("")
    const [modalGasto, setModalGasto] = useState(true)
    const [gastos, setGastos] = useState([])

    const dataGastoCompleta = !(!nombre || !cantidad || !unidad || !gasto_total)
    console.log(dataGastoCompleta)

    const clearInputs = () => {
        setNombre("")
        setCantidad("")
        setUnidad("")
        setGastoTotal("")
        setModalGasto(false)
    }

    useEffect(() => {
        const fetchGastos = async() => {
            try {
                const dataGastos = query(collection(db, "gastos"), 
                orderBy('timestamp', 'desc'), 
                limit(10)
                )

                const querySnapshot = await getDocs(dataGastos);
                const getDataGastos = querySnapshot.docs.map((doc) => ({...doc.data(), id: doc.id}))   
                setGastos(getDataGastos)

            } catch (error) {
                console.log(error)
            }
        }
        fetchGastos();
    }, [])
    

    const crearGasto = async() => {
        if(dataGastoCompleta){
            try {
                const data = {
                    nombre: nombre,
                    cantidad: cantidad,
                    unidad: unidad,
                    gasto_total: gasto_total,
                    creado_por: `${usuario?.nombre} ${usuario?.apellidos}`,
                    timestamp: new Date().getTime(),
                }
                await addDoc(collection(db, "gastos"), data)
                swal({
                    title: "Gasto ingresado con exito",
                    icon: "success"
                })
                clearInputs()
            } catch (error) {
                console.log(error)
            }
        } else {
            swal({
                title: "Error",
                icon: "error"
            })
        }
    }
    
    const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre" ]



    return (
        <Container className="pabenorme parmediano">
            <Row>
                <Col>
                    <Button className="w100 botonRojo" onClick={() => setModalGasto(!modalGasto)}><FaPlus className="tIconos"/> Gasto</Button>
                </Col>
                <Col>
                    <Button className="w100 botonVerdeObscuro"><FaPlus className="tIconos"/> Activo</Button>
                </Col>
            </Row>
            <hr />
            <Row>
                <Col xs={12} lg={6}>
                    <div>
                        <span className="wbold t20 rojoObscuro">Gastos</span>
                    </div>
                    <div className="overflowGastos">
                        {gastos.map((g, i) => (
                            <div key={i} className="pabmediano">
                                <Card className="claseCard pmediano">
                                    <div className="wbold">{new Date(g.timestamp).getDate()} de {meses[((new Date(g.timestamp).getMonth()))]} de {new Date(g.timestamp).getFullYear()}</div>
                                    <div>
                                    <NumberFormat displayType={'text'} thousandSeparator={true} prefix={'$'} value={g.gasto_total} /> - {g.cantidad} {g.unidad ? g.unidad : ""} de <span className="wbold t16 azul">{g.nombre.toUpperCase()}</span> (Jorge de la Mora Menéndez)
                                    </div>
                                </Card>
                            </div>
                        ))}
                    </div>
                </Col>
                <hr className="d-block d-lg-none" />
                <Col>
                    <div>
                        <span className="wbold t20 verdeObscuro">Activos</span>
                    </div>
                    <div className="overflowGastos">
                        <div className="pabmediano">
                            <Card className="claseCard pmediano">
                                {!areaEditar && <Row>
                                    <Col className="parmicro">
                                        <span className="wbold t16 azul">{"Racks".toUpperCase()}</span> x 20pzas ($2,954) 
                                    </Col>
                                    <Col xs={2} className="derecha"><Button onClick={() => setAreaEditar(true)}className="botonAmarilloComentario"><FaPen className="claseIconos" /></Button></Col>
                                </Row>}
                                {areaEditar && <>
                                        <Input type="string" value={nombre} placeholder={"nombre"} onChange={e => setNombre(e.target.value)} />
                                        <Input type="number" value={cantidad} placeholder={"20pzas"} onChange={e => setCantidad(e.target.value)} />
                                        <Input type="number" value={costo_unitario} placeholder={"costo_unitario"} onChange={e => setCostoUnitario(e.target.value)} />
                                        <div className="parchico">
                                            <Button onClick={() => setAreaEditar(false)} className="botonRojo w100">Cancelar</Button>
                                        </div>
                                </>}
                            </Card>
                        </div>
                    </div>
                </Col>
            </Row>
            <Modal isOpen={modalGasto} toggle={() => setModalGasto(!modalGasto)}>
                <div className="pgrande">
                    <div className="wbold">Nombre:</div>
                    <Input type="string" value={nombre} placeholder="Ej: Burbuja" onChange={e => setNombre(e.target.value)} />
                    <div className="wbold">Cantidad:</div>
                    <Input type="number" value={cantidad} placeholder="Ej: 50" onChange={e => setCantidad(e.target.value)} />
                    <div className="wbold">Unidad:</div>
                    <Input type="string" value={unidad} placeholder="Ej: metros" onChange={e => setUnidad(e.target.value.toLowerCase())} />
                    <div className="wbold">Gasto total:</div>
                    <Input type="number" value={gasto_total} placeholder="Ej: 830" onChange={e => setGastoTotal(e.target.value)} />
                    <div className="centro pchico">Gasto generado por: <span className="wbold">{usuario?.nombre} {usuario?.apellidos}</span></div>
                    <div className="pabmuychico">
                        <Button onClick={() => {crearGasto()}} className="botonAmarillo w100" disabled={!dataGastoCompleta}>Generar gasto</Button>
                    </div>
                    <Button onClick={() => setModalGasto(!modalGasto)} className="botonRojo w100">Cancelar</Button>
                </div>
            </Modal>
        </Container>
    );
}

export default Contabilidad;
