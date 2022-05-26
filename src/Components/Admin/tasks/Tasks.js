import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { Button, Card, Col, Input, Modal, Row, Spinner } from "reactstrap";
import { FaPlus, FaTrash } from 'react-icons/fa'
import { db } from "../../../firebase-config";
import swal from "sweetalert";
import UsuarioContext from "../context/UsuarioContext";
import MenuAdmin from "../MenuAdmin";
import Menu from "../../menu/Menu";

function Tasks() {
    const {usuarioLoggeado} = useContext(UsuarioContext)

    const [modal, setModal] = useState(false)
    const [nombre, setNombre] = useState("")
    const [prioridad, setPrioridad] = useState("")
    const [usuario, setUsuario] = useState("")
    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(true)

    const crearTask = async() => {
        if(nombre && prioridad && usuario){
            try{
                const data = {nombre: nombre, prioridad: prioridad, usuario: usuario, timestamp: new Date().getTime()}
                await addDoc(collection(db, "tasks"), data)
                setTasks([...tasks, data])
                setNombre("")
                setPrioridad("")
                setUsuario("")

                swal({ 
                    title: "Task creado con exito", 
                    text: "", 
                    icon: "success", 
                })
            } catch (error) {
                swal({ 
                    title: "Error" , 
                    text: error.message, 
                    icon: "error", 
                })
            }
        }
    }
    const borrarTask = async(producto) => {
        try{
            await deleteDoc(doc(db, "tasks", producto.id))
            const index = tasks.findIndex(p => p.id === producto.id)
            tasks.splice(index, 1)
            setTasks([...tasks])

            swal({ 
                title: "Task eliminado", 
                text: "", 
                icon: "success", 
            })
        } catch (error) {
            swal({ 
                title: "Error" , 
                text: error.message, 
                icon: "error", 
            })
        }
    }

	const links = [
		{
			nombre: "Catálogo",
			path: `/`,
		},
		{
			nombre: "Solicitar productos",
			path: `/solicitar`,
		},
        {
            nombre: "Tareas",
            path: `/tasks`,
        }
	];

    useEffect(() => {
        const getSolicitados = async() => {
            const tasksRef = query(collection(db, "tasks"), orderBy('prioridad', 'asc'))
            const querySnapshot = await getDocs(tasksRef);
            const getDataTasks = querySnapshot.docs.map((doc) => ({...doc.data(), id: doc.id}))   
            setTasks(getDataTasks)
            setLoading(false)
        }
        getSolicitados()
    }, [])

    const items = usuarioLoggeado ? [{user: "Jorge (hijo)"}, {user: "Ana"}, {user: "Jorge (papá)"}, {user: "Fanny"}, {user: "Otros"}] : [{user: "Fanny"}, {user: "Otros"}]

    return (
        <>
        {usuarioLoggeado && <MenuAdmin />}
        {!usuarioLoggeado && <Menu links={links} logoNegro  />}
            <div className="penorme">
                {usuarioLoggeado && <div className='centro pabmediano'>
                    <Button className="botonAzul" onClick={() => setModal(!modal)}><FaPlus className="tIconos" /> Crear tarea</Button>
                </div>}

                {/* JORGE HIJO */}
                {items.map((item, i) => tasks.filter(t => t.usuario === item.user).length > 0 && <div className="pabchico">
                    <Card key={i} className="penorme">
                       {loading ? <Spinner /> : <div>
                            <div className="wbold t20 azul">{item.user}</div>
                            <hr />
                            {tasks.filter(t => t.usuario === item.user).map((t, i) => 
                                <Row key={i} className="wbold">
                                    <Col>
                                        {t.nombre} - <span className={`${t.prioridad === "1" ? "rojo" : t.prioridad === "2" ? "naranja" : t.prioridad === "3" ? "amarillo" : t.prioridad === "4" ? "verde" : "negro" }`}>{t.prioridad === "1" ? "Urgente" : t.prioridad === "2" ? "Necesario" : t.prioridad === "3" ? "Conveniente" : t.prioridad === "4" ? "Opcional" : "Error" }</span>
                                    </Col>
                                    {usuarioLoggeado && <Col xs={3}>
                                        <Button onClick={() => borrarTask(t)} className="botonRojoComentario"><FaTrash className="tIconos" /></Button>
                                    </Col>}
                                </Row>
                            )}
                       </div>}
                    </Card>
                </div>)}
            </div>
            <Modal isOpen={modal} toggle={() => setModal(!modal)}>
                <div className='pgrande'>
                    <Input type="text" placeholder='Tarea a realizar' value={nombre} onChange={e => setNombre(e.target.value)} />
                    <Input type="select" value={prioridad} onChange={e => setPrioridad(e.target.value)} >
                        <option value="" disabled>Prioridad:</option>
                        <option value="1">Urgente</option>
                        <option value="2">Necesario</option>
                        <option value="3">Conveniente</option>
                        <option value="4">Estaría bien</option>
                    </Input>
                    <Input type="select" placeholder='Cantidad solicitada' value={usuario} onChange={e => setUsuario(e.target.value)} >
                        <option value="" disabled>Usuario encargado:</option>
                        <option>Jorge (hijo)</option>
                        <option>Ana</option>
                        <option>Jorge (papá)</option>
                        <option>Fanny</option>
                        <option>Otro</option>
                    </Input>
                </div>
                <Button disabled={!nombre || !prioridad || !usuario}className="botonAzul" onClick={() => {crearTask()}}>Crear tarea</Button>
                <Button className="botonRojo" onClick={() => setModal(!modal)}>Cancelar</Button>
            </Modal>
        </>      
    );
}

export default Tasks;
