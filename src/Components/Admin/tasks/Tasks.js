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
    const [modal2, setModal2] = useState(false)
    const [nombre, setNombre] = useState("")
    const [prioridad, setPrioridad] = useState("")
    const [usuario, setUsuario] = useState("")
    const [empleados, setEmpleados] = useState("")
    const [nombreEmpleado, setNombreEmpleado] = useState("")
    const [rol, setRol] = useState("")
    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(true)

    const crearTask = async() => {
        if(nombre && prioridad && usuario){
            try{
                const data = {nombre: nombre, prioridad: prioridad, usuario: usuario, rol: empleados?.filter(e => e.nombre === usuario)[0].rol, timestamp: new Date().getTime()}
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
            nombre: "Tareas",
            path: `/tasks`,
        }
	];

    const crearEmpleado = async() => {
        if(nombreEmpleado && rol){
            try{
                const data = {nombre: nombreEmpleado, rol: rol}
                await addDoc(collection(db, "empleados"), data)
                setNombreEmpleado("")
                setRol("")

                swal({ 
                    title: "Empleado creado con exito", 
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

    // cargar tasks
    useEffect(() => {
        const getTasks = async() => {
            const tasksRef = query(collection(db, "tasks"), orderBy('prioridad', 'asc'))
            const querySnapshot = await getDocs(tasksRef);
            const getDataTasks = querySnapshot.docs.map((doc) => ({...doc.data(), id: doc.id}))   
            setTasks(getDataTasks)
            setLoading(false)
        }
        getTasks()
    }, [])

    // cargar empleados
    useEffect(() => {
        const getEmpleados = async() => {
            const empleadosRef = query(collection(db, "empleados"), orderBy('rol', 'asc'))
            const querySnapshot = await getDocs(empleadosRef);
            const getDataEmpleados = querySnapshot.docs.map((doc) => ({...doc.data(), id: doc.id}))   
            setEmpleados(getDataEmpleados)
            setLoading(false)
        }
        getEmpleados()
    }, [])

    const items = tasks?.map(task => ({user: `${task.usuario}`, rol: `${task.rol}`}))
    const unique = items.filter((value, index) => {
        const _value = JSON.stringify(value);
        return index === items.findIndex(obj => {
          return JSON.stringify(obj) === _value;
        });
      });

    const itemsFinales = !usuarioLoggeado ? unique.filter(item => item.rol === "empleado") : unique



    return (
        <>
        {usuarioLoggeado && <MenuAdmin />}
        {!usuarioLoggeado && <Menu links={links} logoNegro  />}
            <div className="penorme">
                <div className='centro pabmediano'>
                    {usuarioLoggeado && <><div className="d-inline pdemediano">
                        <Button className="botonBlanco" onClick={() => setModal2(!modal2)}><FaPlus className="tIconos" /> Empleado</Button></div> 
                    <Button className="botonAzul" onClick={() => setModal(!modal)}><FaPlus className="tIconos" /> Crear tarea</Button></>
                    }
                </div>

                {/* TASKS */}
                {loading ? <div className="centro pargrande"><Spinner className="azul" /></div> : <>
                    {itemsFinales.map((item, i) => tasks.filter(t => t.usuario === item.user).length > 0 && <div className="pabchico">
                        <Card key={i} className="penorme">
                           {loading ? <Spinner /> : <div>
                                <div className="wbold t20 azul">{item.user}</div>
                                <hr />
                                {tasks.filter(t => t.usuario === item.user).map((t, i) => 
                                    <>
                                        <Row key={i} className="wbold t13">
                                            <Col>
                                                {t.nombre} - <span className={`${t.prioridad === "1" ? "rojo" : t.prioridad === "2" ? "naranja" : t.prioridad === "3" ? "amarillo" : t.prioridad === "4" ? "verde" : "negro" }`}>{t.prioridad === "1" ? "Urgente" : t.prioridad === "2" ? "Necesario" : t.prioridad === "3" ? "Conveniente" : t.prioridad === "4" ? "Opcional" : "Error" }</span>
                                            </Col>
                                            {usuarioLoggeado && <Col xs={3}>
                                                <Button 
                                                    onClick={() => swal({ 
                                                            title: "¿Estás segur@?" , 
                                                            text: "No podrás revertirlo!", 
                                                            icon: "warning", 
                                                            buttons: ["Cancelar", "Borrar"]
                                                        }).then((res) => {if(res){borrarTask(t)}})} 
                                                    className="botonRojoComentario"><FaTrash className="tIconos" /></Button>
                                            </Col>}
                                        </Row>
                                        <hr className="sinpym" />
                                    </>
                                )}
                           </div>}
                        </Card>
                    </div>)}
                </>}
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
                        {empleados && empleados.map((e, i) => <option key={i}>{e.nombre}</option>)}
                    </Input>
                </div>
                <Button disabled={!nombre || !prioridad || !usuario}className="botonAzul" onClick={() => {crearTask()}}>Crear tarea</Button>
                <Button className="botonRojo" onClick={() => setModal(!modal)}>Cancelar</Button>
            </Modal>
            <Modal isOpen={modal2} toggle={() => setModal2(!modal2)}>
                <div className='pgrande'>
                    <Input type="text" placeholder='Nombre completo' value={nombreEmpleado} onChange={e => setNombreEmpleado(e.target.value)} />
                    <Input type="select" value={rol} onChange={e => setRol(e.target.value)} >
                        <option value="" disabled>Rol:</option>
                        <option value="admin">Admin</option>
                        <option value="empleado">Empleado</option>
                    </Input>
                </div>
                <Button disabled={!nombreEmpleado || !rol}className="botonAzul" onClick={() => {crearEmpleado()}}>Crear empleado</Button>
                <Button className="botonRojo" onClick={() => setModal2(!modal2)}>Cancelar</Button>
            </Modal>
        </>      
    );
}

export default Tasks;
