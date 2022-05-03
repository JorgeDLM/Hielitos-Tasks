import React, { useEffect, useState } from "react"
import { Container, Card, Row, Col, Spinner } from "reactstrap"
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore"
import { db } from "../../../firebase-config"
import NumberFormat from "react-number-format"
import ModalAgregarGastosActivos from "./ModalAgregarGastosActivos"
import CardActivo from "./CardActivo"


function Contabilidad() {

    const [gastos, setGastos] = useState([])
    const [activos, setActivos] = useState([])
    const [loading, setLoading] = useState(true)


// FETCH GASTOS
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
        setLoading(false)
    }, [])

// FETCH ACTIVOS
    useEffect(() => {
        const fetchActivos = async() => {
            try {
                const dataActivos = query(collection(db, "activos"), 
                    orderBy('nombre', 'asc'), 
                    // limit(10)
                )

                const querySnapshot = await getDocs(dataActivos);
                const getDataActivos = querySnapshot.docs.map((doc) => ({...doc.data(), id: doc.id}))   
                setActivos(getDataActivos)

            } catch (error) {
                console.log(error)
            }
        }
        fetchActivos();
        setLoading(false)
    }, [])
    
    
    const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre" ]
    const spinner = (<div className="pabmediano"><Card className="pgrande"><div className="centro pgrande azul"><Spinner /></div></Card></div>)



    return (
        <Container className="pabenorme parmediano">
            <ModalAgregarGastosActivos gastos={gastos} setGastos={setGastos} />
            <hr />
            <Row>
                <Col xs={12} lg={6}>
                    <div>
                        <span className="wbold t20 rojoObscuro">Gastos</span>
                    </div>
                    {(loading || gastos.length <= 0) ? spinner : <div className="overflowGastos">
                        {gastos.map((g, i) => (
                            <div key={i} className="pabmediano">
                                <Card className="claseCard pmediano">
                                    <div className="wbold">{new Date(g.timestamp).getDate()} de {meses[((new Date(g.timestamp).getMonth()))]} de {new Date(g.timestamp).getFullYear()}</div>
                                    <div>
                                    <NumberFormat displayType={'text'} thousandSeparator={true} prefix={'$'} value={g.gasto_total} /> - {g.cantidad} {g.unidad ? g.unidad : ""} de <span className="wbold t16 azul">{g.nombre.toUpperCase()}</span> ({g.creado_por})
                                    </div>
                                </Card>
                            </div>
                        ))}
                    </div>}
                </Col>
                <hr className="d-block d-lg-none" />
                <Col>
                    <div>
                        <span className="wbold t20 verdeObscuro">Activos</span> {(!loading || activos.length) && 
                            <span className="wbold t16">- <NumberFormat displayType={'text'} thousandSeparator={true} prefix={'$'} value={activos.length && activos?.map(a => +a.costo_unitario * +a.cantidad)?.reduce((total, entrada) =>  (total += entrada))} /></span>
                        }
                    </div>
                    {(loading || activos.length <= 0) ? spinner : <div className="overflowActivos">
                        {activos && activos?.map((a,i) => (
                            <div key={i} className="pabmediano">
                                <CardActivo a={a} id={a.id} cantidad={a.cantidad} nombre={a.nombre} costo_unitario={a.costo_unitario} setLoading={setLoading} />
                            </div>
                        ))}
                    </div>}
                </Col>
            </Row>
        </Container>
    );
}

export default Contabilidad;
