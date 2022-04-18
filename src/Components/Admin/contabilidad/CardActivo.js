import React, { useState } from "react"
import { Card, Row, Col, Button, Input } from "reactstrap"
import { FaPen } from 'react-icons/fa'
import { doc, updateDoc } from "firebase/firestore"
import { db } from "../../../firebase-config"
import NumberFormat from "react-number-format"
import swal from "sweetalert"


function CardActivo({id, cantidad, nombre, costo_unitario, a, setLoading}) {

    const [areaEditar, setAreaEditar] = useState(false)
    const [nombreEditar, setNombre] = useState(nombre ? nombre : "")
    const [cantidadEditar, setCantidad] = useState(cantidad ? cantidad : "")
    const [costo_unitarioEditar, setCostoUnitario] = useState(costo_unitario ? costo_unitario : "")
    const [loading, setLoadingCard] = useState(false)

    const dataActivoCompleta = !(!nombre || !cantidad || !costo_unitario)

    const setDefault = () => {
        setNombre(nombre ? nombre : "")
        setCantidad(cantidad ? cantidad : "")
        setCostoUnitario(costo_unitario ? costo_unitario : "")
    }

    const actualizarActivo = async() => {
        setLoadingCard(true)
        if(dataActivoCompleta){
            try {
                const data = {
                    nombre: nombreEditar,
                    cantidad: +cantidadEditar,
                    costo_unitario: +costo_unitarioEditar,
                }
                await updateDoc(doc(db, "activos", id), data)
                swal({
                    title: "Activo actualizado con exito",
                    icon: "success"
                })
                setAreaEditar(false)
                window.location.reload()
                setLoadingCard(false)
                setLoading(true)
            } catch (error) {
                console.log(error)
                setLoadingCard(false)
            }
        } else {
            swal({
                title: "Error",
                icon: "error"
            })
            setLoadingCard(false)
        }
    }

    const prevDefault = (e) => {
        if (e.key === '+' || e.key === '-' || e.key === 'e' || e.key === 'E'){
            e.preventDefault();
        }
    }

    return (
        <Card className="claseCard pmediano">
            {!areaEditar && <Row>
                <Col className="parmicro">
                    <span className="wbold t16 azul">
                        {(nombreEditar !== "" ? nombreEditar.toUpperCase() : a.nombre.toUpperCase())}
                    </span> x {(cantidadEditar !== "" ? cantidadEditar : a.cantidad)}{(a.cantidad === "1"  || cantidadEditar === "1") ? " pza" : " pzas"} 
                    <span className="pizmuychico">
                        (<NumberFormat displayType={'text'} thousandSeparator={true} prefix={'$'} value={(cantidadEditar !== "" ? cantidadEditar : a.cantidad) * (costo_unitarioEditar !== "" ? costo_unitarioEditar : a.costo_unitario)} />)
                    </span>
                </Col>
                <Col xs={2} className="derecha"><Button onClick={() => setAreaEditar(true)}className="botonAmarilloComentario"><FaPen className="claseIconos" /></Button></Col>
            </Row>}
            {areaEditar && <>
                    <div className="wbold">Nombre:</div>
                    <Input type="string" value={nombreEditar} placeholder={"Ej: Impresora"} onChange={e => setNombre(e.target.value)} />
                    <div className="wbold">Cantidad:</div>
                    <Input type="number" onKeyPress={(e) => prevDefault(e)} min={0} value={cantidadEditar} placeholder={"Ej: 1 pza"} onChange={e => setCantidad(e.target.value)} />
                    <div className="wbold">Costo unitario:</div>
                    <Input type="number" onKeyPress={(e) => prevDefault(e)} min={0} value={costo_unitarioEditar} placeholder={"Ej: $564"} onChange={e => setCostoUnitario(e.target.value)} />
                    <div className="parchico">
                        <Button disabled={loading} onClick={() => actualizarActivo()} className="botonAmarillo w100">Guardar cambios</Button>
                    </div>
                    <div className="parchico">
                        <Button onClick={() => {setAreaEditar(false); setDefault()}} className="botonRojo w100">Cancelar</Button>
                    </div>
            </>}
        </Card>
    );
}

export default CardActivo;
