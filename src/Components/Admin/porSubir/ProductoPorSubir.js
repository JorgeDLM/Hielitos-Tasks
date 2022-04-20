import React, { useState } from "react";
import { Card, Row, Col, Button, Input, InputGroup } from "reactstrap";
import { FaCopy, FaPlus, FaCheck } from 'react-icons/fa'
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase-config";

function ProductoPorSubir(props) {

    const [ver, setVer] = useState(false)
    const [ML, setML] = useState(props.p.subido)
    const [amazon, setAmazon] = useState(props.p.subido_amazon)
    const [facebook, setFacebook] = useState(props.p.subido_facebook)
    const [cuenta, setCuenta] = useState("")


  
    const copiarNombre = () => {
        navigator.clipboard.writeText(props.p.nombre)
    }
    const copiarTitulo = () => {
        navigator.clipboard.writeText(props.p.titulo)
    }
    const copiarTematica = () => {
        navigator.clipboard.writeText(props.p.tematica)
    }
    const copiarCategoria = () => {
        navigator.clipboard.writeText(props.p.categoria)
    }
    const copiarPrecioVenta = () => {
        navigator.clipboard.writeText(props.p.precio_venta_ml)
    }
    const copiarCodigoUniversal = () => {
        navigator.clipboard.writeText(props.p.codigo_universal)
    }
    const copiarMedidas = () => {
        navigator.clipboard.writeText(props.p.medidas)
    }
    const copiarMaterial = () => {
        navigator.clipboard.writeText(props.p.material)
    }
    const copiarCantidad = () => {
        navigator.clipboard.writeText(props.p.cantidad)
    }
    
    const copiarDescripcion = () => {
        navigator.clipboard.writeText(props.p.descripcion)
    }
    
    const copiarMarca = () => {
        navigator.clipboard.writeText(cuenta === "jorge" ? "Somos Geek" : cuenta === "ana" ? "The Gamer Zone" : "Genérico")
    }

    const botones = [
        {   
            nombre: "Nombre:", 
            texto: props.p.nombre, 
            copiar: copiarNombre,
            col: 12
        },
        {   
            nombre: "Categoría:", 
            texto: props.p.categoria, 
            copiar: copiarCategoria,
            col: 12
        },
        {   
            input:
                <Input type="select" value={cuenta} onChange={e => setCuenta(e.target.value)}>
                    <option disabled value="">Marca: ¿Dónde lo estás subiendo?</option>
                    <option value="jorge">Cuenta de Jorge</option>
                    <option value="ana">Cuenta de Ana</option>
                    <option value="otro">Otro lado</option>
                </Input>,
            copiar: copiarMarca,
            col: 12
        },
        {   
            nombre: "Modelo:", 
            texto: props.p.tematica, 
            copiar: copiarTematica,
            col: 12
        },
        {   
            nombre: "Título:", 
            texto: props.p.titulo, 
            copiar: copiarTitulo,
            col: 12
        },
        {   
            nombre: "Cantidad:", 
            texto: props.p.cantidad, 
            copiar: copiarCantidad,
            col: 12
        },
        {   
            nombre: "Código universal", 
            copiar: copiarCodigoUniversal,
            col: 4
        },
        {   
            nombre: "Medidas:", 
            texto: props.p.medidas, 
            copiar: copiarMedidas,
            col: 4
        },
        {   
            nombre: "Material:", 
            texto: props.p.material, 
            copiar: copiarMaterial,
            col: 4
        },
        {   
            nombre: "Precio:", 
            texto: "$" + props.p.precio_venta_ml, 
            copiar: copiarPrecioVenta,
            col: 12
        },
    ]

    const contenido = 
        <Row>
            {botones.map((b, i) => (
                <Col lg={b.col} key={i}>{b.copiar && <InputGroup className={!b.input && "d-inline"}><Button onClick={b.copiar} className="botonAzul"><FaCopy className="claseIconos" /></Button>{b.input && b.input}</InputGroup>}{!b.input && <><span className="wbold rojoObscuro pizmuychico d-inline">{b.nombre}</span> {b.texto}</>}</Col>
            ))}
        </Row>

   
    
    const actualizarProductoML = async() => {
        try {
            const data = {
                subido: !ML,
            }
            await updateDoc(doc(db, "productos", props.p.id), data)
        } catch (error) {
            console.log(error)
        }
    }
    const actualizarProductoAmazon = async() => {
        try {
            const data = {
                subido_amazon: !amazon,
            }
            await updateDoc(doc(db, "productos", props.p.id), data)
        } catch (error) {
            console.log(error)
        }
    }
    const actualizarProductoFB = async() => {
        try {
            const data = {
                subido_facebook: !facebook,
            }
            await updateDoc(doc(db, "productos", props.p.id), data)
        } catch (error) {
            console.log(error)
        }
    }

    const palabras = props.p.nombre.split(" ");
    const nombre = palabras.map(p => ((p[0] !== undefined && p[0]?.toUpperCase()) === false ? "" : (p[0] !== undefined && p[0]?.toUpperCase())) + (p !== undefined && p.substring(1).toLowerCase()) + " ")

    return (
        <>
            {/* {!(ML && amazon && facebook) && <div className="parchico"> */}
            {<div className={ver ? "parchico pabmediano" : "parchico"}>
                <Card className={ver ? "claseCard fondoVerdeClaro" : "claseCard"}>
                    <div className="pmediano">
                        <Row>
                            <Col xs={4} md={3}>
                                <div className="pizchico"><img className="productoLista" src={props.p.imagen} alt="error" /></div>
                            </Col>
                            <Col>
                                <div className="t16 wbold">{nombre}</div>
                                <Row className="parchico">
                                    <Col>{!ML ? <><Button className="botonAmarilloComentario" onClick={() => {setML(true); actualizarProductoML()}} >
                                        <FaPlus className="claseIconos" /></Button> ML</> : 
                                        <><Button onClick={() => {setML(false); actualizarProductoML()}} className="botonVerdeComentario" ><FaCheck className="claseIconos" /></Button> Subido en ML</>}</Col>

                                    <Col>{!amazon ? <><Button className="botonAmarilloComentario" onClick={() => {setAmazon(true); actualizarProductoAmazon()}} >
                                        <FaPlus className="claseIconos" /></Button> Amazon</> : 
                                        <><Button onClick={() => {setAmazon(false); actualizarProductoAmazon()}} className="botonVerdeComentario" ><FaCheck className="claseIconos" /></Button> Subido en Amazon</>}</Col>

                                    <Col>{!facebook ? <><Button className="botonAmarilloComentario" onClick={() => {setFacebook(true); actualizarProductoFB()}} >
                                        <FaPlus className="claseIconos" /></Button> FB</> : 
                                        <><Button onClick={() => {setFacebook(false); actualizarProductoFB()}} className="botonVerdeComentario" ><FaCheck className="claseIconos" /></Button> Subido en FB</>}</Col>
                                </Row>
                            </Col>
                        </Row>
                        {ver && <hr />}
                    </div>
                    {!ver && <Button onClick={() => setVer(!ver)} className="botonTransparente w100 azul wbold">Ver más</Button>}
                        {ver && <div className="pizchico pdechico pabchico">
                            {contenido}
                            <hr />
                            <div className="descripcion"><Button onClick={copiarDescripcion} className="botonAzul"><FaCopy className="claseIconos" /></Button> <span className="wbold rojoObscuro">Descripción:</span>
                                    
                             <br />{props.p.descripcion}</div>
                        </div>}
                    {ver && <Button onClick={() => setVer(!ver)} className="botonTransparente w100 azul wbold">Ver menos</Button>}
                </Card>
            </div>}
        </>
    );
}

export default ProductoPorSubir;
