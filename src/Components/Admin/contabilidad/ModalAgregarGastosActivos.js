import React, { useContext, useState } from "react";
import { Row, Col, Button, Input, Modal } from "reactstrap";
import { FaPlus } from 'react-icons/fa'
import UsuarioContext from "../context/UsuarioContext";
import swal from "sweetalert";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../../firebase-config";


function ModalAgregarGastosActivos({gastos, setGastos}) {
    const {usuario} = useContext(UsuarioContext)

    const [nombre, setNombre] = useState("")
    const [cantidad, setCantidad] = useState("")
    const [unidad, setUnidad] = useState("")
    const [gasto_total, setGastoTotal] = useState("")
    const [costo_unitario, setCostoUnitario] = useState("")
    const [modalGasto, setModalGasto] = useState(false)
    const [modalActivos, setModalActivos] = useState(false)

    const dataGastoCompleta = !(!nombre || !cantidad || !unidad || !gasto_total)
    const dataActivoCompleta = !(!nombre || !cantidad || !costo_unitario)

    const clearInputs = () => {
        setNombre("")
        setCantidad("")
        setUnidad("")
        setGastoTotal("")
        setCostoUnitario("")
        setModalGasto(false)
        setModalActivos(false)
    }

    const crearActivo = async() => {
        if(dataActivoCompleta){
            try {
                const data = {
                    nombre: nombre,
                    cantidad: +cantidad,
                    costo_unitario: +costo_unitario,
                }
                await addDoc(collection(db, "activos"), data)
                swal({
                    title: "Activo creado con exito",
                    icon: "success"
                })
                window.location.reload()
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

    const crearGasto = async() => {
        if(dataGastoCompleta){
            try {
                const data = {
                    nombre: nombre,
                    cantidad: +cantidad,
                    unidad: unidad,
                    gasto_total: +gasto_total,
                    creado_por: `${usuario?.nombre} ${usuario?.apellidos}`,
                    timestamp: new Date().getTime(),
                }
                await addDoc(collection(db, "gastos"), data)
                swal({
                    title: "Gasto ingresado con exito",
                    icon: "success"
                })
                clearInputs()
                setGastos([data, ...gastos])
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
    

    const prevDefault = (e) => {
        if (e.key === '+' || e.key === '-' || e.key === 'e' || e.key === 'E'){
            e.preventDefault();
        }
    }
    
    return (
        <>
            <Row>
                <Col>
                    <Button className="w100 botonRojo" onClick={() => setModalGasto(!modalGasto)}><FaPlus className="tIconos"/> Gasto</Button>
                </Col>
                <Col>
                    <Button className="w100 botonVerdeObscuro" onClick={() => setModalActivos(!modalActivos)}><FaPlus className="tIconos"/> Activo</Button>
                </Col>
            </Row>
            {/* MODAL ACTIVOS */}
            <Modal isOpen={modalActivos} toggle={() => setModalActivos(!modalActivos)}>
                <div className="pgrande">
                    <div className="wbold">Nombre:</div>
                    <Input type="string" value={nombre} placeholder="Ej: Impresora Epson T20i" onChange={e => setNombre(e.target.value)} />
                    <div className="wbold">Cantidad:</div>
                    <Input type="number" onKeyPress={(e) => prevDefault(e)} min={0} value={cantidad} placeholder="Ej: 1" onChange={e => setCantidad(e.target.value)} />
                    <div className="wbold">Costo unitario:</div>
                    <Input type="number" onKeyPress={(e) => prevDefault(e)} min={0} value={costo_unitario} placeholder="Ej: $3,500" onChange={e => setCostoUnitario(e.target.value)} />
                    <div className="pabmuychico parchico">
                        <Button onClick={() => {crearActivo()}} className="botonVerdeObscuro w100" disabled={!dataActivoCompleta}>Crear activo</Button>
                    </div>
                    <Button onClick={() => setModalActivos(!modalActivos)} className="botonRojo w100">Cancelar</Button>
                </div>
            </Modal>
            {/* MODAL GASTOS */}
            <Modal isOpen={modalGasto} toggle={() => setModalGasto(!modalGasto)}>
                <div className="pgrande">
                    <div className="wbold">Nombre:</div>
                    <Input type="string" value={nombre} placeholder="Ej: Burbuja" onChange={e => setNombre(e.target.value)} />
                    <div className="wbold">Cantidad:</div>
                    <Input type="number" onKeyPress={(e) => prevDefault(e)} min={0} value={cantidad} placeholder="Ej: 50" onChange={e => setCantidad(e.target.value)} />
                    <div className="wbold">Unidad:</div>
                    <Input type="string" value={unidad} placeholder="Ej: metros" onChange={e => setUnidad(e.target.value.toLowerCase())} />
                    <div className="wbold">Gasto total:</div>
                    <Input type="number" onKeyPress={(e) => prevDefault(e)} min={0} value={gasto_total} placeholder="Ej: $830" onChange={e => setGastoTotal(e.target.value)} />
                    <div className="centro pchico">Gasto generado por: <span className="wbold">{usuario?.nombre} {usuario?.apellidos}</span></div>
                    <div className="pabmuychico">
                        <Button onClick={() => {crearGasto()}} className="botonAmarillo w100" disabled={!dataGastoCompleta}>Generar gasto</Button>
                    </div>
                    <Button onClick={() => setModalGasto(!modalGasto)} className="botonRojo w100">Cancelar</Button>
                </div>
            </Modal>
        </>
    );
}

export default ModalAgregarGastosActivos;
