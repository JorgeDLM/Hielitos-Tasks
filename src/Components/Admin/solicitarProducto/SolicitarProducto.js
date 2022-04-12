import React, { useContext, useEffect, useState } from 'react'
import { Button, Card, Col, Container, Input, Modal, Row, Spinner } from 'reactstrap';
import Menu from '../../menu/Menu'
import { FaPlus, FaTrash } from 'react-icons/fa'
import { addDoc, collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase-config';
import swal from 'sweetalert';
import UsuarioContext from '../context/UsuarioContext';

const SolicitarProducto = () => {

    const {usuarioLoggeado} = useContext(UsuarioContext)

    const [modal, setModal] = useState(false)
    const [nombre, setNombre] = useState("")
    const [cantidad, setCantidad] = useState("")
    const [inventario, setInventario] = useState("")
    const [productosSolicitados, setProductosSolicitados] = useState([])
    const [loading, setLoading] = useState(true)

	const links = [
		{
			nombre: "Producto solicitado",
			path: `/solicitar`,
		},

	];

    const crearSolicitud = async() => {
        if(nombre){
            try{
                const data = {nombre: nombre, cantidad: cantidad, inventario: inventario}
                await addDoc(collection(db, "productos_solicitados"), data)
                setProductosSolicitados([...productosSolicitados, data])
                setNombre("")
                setCantidad("")
                setInventario("")

                swal({ 
                    title: "Producto solicitado", 
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
    const borrarSolicitud = async(producto) => {
        try{
            await deleteDoc(doc(db, "productos_solicitados", producto.id))
            const index = productosSolicitados.findIndex(p => p.id === producto.id)
            productosSolicitados.splice(index, 1)
            setProductosSolicitados([...productosSolicitados])

            swal({ 
                title: "Producto eliminado", 
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

    useEffect(() => {
        const getSolicitados = async() => {
            const productosRef = await getDocs(collection(db, "productos_solicitados"))
            const getDataProductos = productosRef.docs.map((doc) => ({...doc.data(), id: doc.id}))
            setProductosSolicitados(getDataProductos)
            setLoading(false)
        }
        getSolicitados()
    }, [])
    

  return (
    <div>
        <Menu links={links} logoNegro  />
        <Container className="pargrande pabepico">
            <div className='centro pabmediano'>
                <Button className="botonAzul" onClick={() => setModal(!modal)}><FaPlus className="tIconos" /> Solicitar producto</Button>
            </div>
            <div>
                {loading ? <div className="centro pabenorme"><Spinner className='gris' /></div> : <>
                    <div className='contenedor'>
                        <Card className="claseCard productosSolicitados pchico centradoEnmedio" >
                            {productosSolicitados.map((p,i) => (
                                <div className='pabmuychico izquierda'>
                                    <Row key={i}>
                                        <Col>
                                            <span className='gris t12'>{p.cantidad && `${p.cantidad} x `}</span><span className="wbold">{p.nombre}</span>{p.cantidad && <div className='gris t12 centro'> (quedan {p.inventario}/pzas)</div>}
                                        </Col>
                                        {usuarioLoggeado && <Col xs={3}>
                                            <Button onClick={() => borrarSolicitud(p)} className="botonRojoComentario"><FaTrash className="tIconos" /></Button>
                                        </Col>}
                                    </Row>
                                    <hr className='sinpym' />
                                </div>
                            ))}
                            {!productosSolicitados.length && <div className="wbold">Aún no has solicitado ni un producto.</div>}
                        </Card>
                    </div>
                </>}
            </div>
            <Modal isOpen={modal} toggle={() => setModal(!modal)}>
                <div className='pgrande'>
                    <Input type="text" placeholder='Nombre' value={nombre} onChange={e => setNombre(e.target.value)} />
                    <Input type="number" placeholder='Cantidad inventario' value={inventario} onChange={e => setInventario(e.target.value)} />
                    <Input type="number" placeholder='Cantidad solicitada' value={cantidad} onChange={e => setCantidad(e.target.value)} />
                </div>
                <Button disabled={!nombre || !inventario || !cantidad}className="botonAzul" onClick={() => {crearSolicitud()}}>Solicitar</Button>
                <Button className="botonRojo" onClick={() => setModal(!modal)}>Cancelar</Button>
            </Modal>
            
        </Container>
    </div>
  )
}

export default SolicitarProducto
