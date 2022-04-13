import React, { useEffect, useState } from "react";
import { Button, Modal, Input, FormGroup, Col } from "reactstrap";
import swal from 'sweetalert';
import logo from '../../../imgs/logoNegro.png'
import { FaPlus } from 'react-icons/fa'
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase-config';


function ModalCategorias() {
    const [modal, setModal] = useState(false)
    const [modal2, setModal2] = useState(false)
    const [categoria, setCategoria] = useState("")
    const [categorias, setCategorias] = useState([])
    const [subCategoria, setSubCategoria] = useState("")
    const [codigo_universal, setCodigoUniversal] = useState("")
    const [loading, setLoading] = useState(true)



// SUBIR CATEGORIA ------------------------------------------------------------
const agregarCategoria = async() => {
    setLoading(true);
    if(!categoria){
        swal({
            title: "Rellene el campo",
            text: "¿Te falta algo?",
            icon: "error",
            button: "cerrar"
        });
        setLoading(false);
        return
    }
    try {
        const data = {
            categoria: categoria,
            codigo_universal: codigo_universal,
        }
        await addDoc(collection(db, "categorias"), data)
        swal({
            title: "¡Felicidades!",
            text: "Has añadido una nueva categoria",
            icon: "success",
            button: "cerrar"
        })
        setLoading(false);
        setCategoria("")
        window.location.reload()

        } catch (error){
            swal({
                title: "Error",
                text: `No se ha podido subir la categoria, ${error.message}`,
                icon: "error",
                button: "cerrar"
            });
            setLoading(false);
        
    }
}
// -----------------------------------------------------------------------------------
    
// SUBIR SUB-CATEGORIA ------------------------------------------------------------
const agregarSubCategoria = async() => {
    setLoading(true);
    if(!categoria && !subCategoria){
        swal({
            title: "Rellene todos los campos",
            text: "¿Te falta algo?",
            icon: "error",
            button: "cerrar"
        });
        setLoading(false);
        return
    }
    try {
        const data = {
            sub_categoria: subCategoria,
        }
        const categoriaID = categorias?.filter(c => categoria === c.categoria)[0]?.id
        await addDoc(collection(db, "categorias", categoriaID, "sub_categorias"), data)
        swal({
            title: "¡Felicidades!",
            text: "Has añadido una nueva sub-categoria",
            icon: "success",
            button: "cerrar"
        })
        setLoading(false);
        setCategoria("")
        window.location.reload()

        } catch (error){
            swal({
                title: "Error",
                text: `No se ha podido subir la sub-categoria, ${error.message}`,
                icon: "error",
                button: "cerrar"
            });
            setLoading(false);
        
    }
}
// -----------------------------------------------------------------------------------

    useEffect(() => {
        const fetchCategorias = async() => {
            const dataCategoria =  await getDocs(collection(db, "categorias"))
            
            const data = dataCategoria.docs.map(doc => ({id: doc.id, ...doc.data()}))
            setCategorias(data)
        }
        fetchCategorias();
        setLoading(false)
    }, [])

    return (
        <React.Fragment>
            <Col className="pizchico"><Button onClick={() => setModal(!modal)} className="botonAmarillo w100"><FaPlus className="t14 pabmuychico" /> Categoria</Button></Col>
            <Col className="pizchico"><Button onClick={() => setModal2(!modal2)} className="botonAzul w100" disabled={loading}><FaPlus className="t14 pabmuychico" /> <span className="d-none d-md-inline">Sub-categoria</span><span className="d-inline d-md-none">Sub</span></Button></Col>
            <Modal isOpen={modal} toggle={() => setModal(!modal)}> 
            <div className="pargrande azul wbolder centro tmuygrande">
                <div className="pabmediano"><img className="productoLista" src={logo} alt="Error" /></div>
                Crear categoria:
                <div className="pizchico pdechico">
                    <FormGroup>
                        <Input type="text" placeholder="Categoria" onChange={(e) => setCategoria(e.target.value)} />
                    </FormGroup>
                </div>
                <div className="pizchico pdechico">
                    <FormGroup>
                        <Input type="text" placeholder="Código universal" onChange={(e) => setCodigoUniversal(e.target.value)} />
                    </FormGroup>
                </div>
                <Button className="botonAmarillo w100" onClick={() => agregarCategoria()}>Crear</Button>
            </div>
            </Modal>
            <Modal isOpen={modal2} toggle={() => setModal2(!modal2)}> 
            <div className="pargrande azul wbolder centro tmuygrande">
                <div className="pabmediano"><img className="productoLista" src={logo} alt="Error" /></div>
                Crear sub-categoria:
                <div className="pizchico pdechico">
                    <FormGroup>
                        <Input type="select" placeholder="Categoria" onChange={(e) => {setCategoria(e.target.value)}}>
                            <option value="seleccione">Seleccione:</option>
                            {categorias?.map((c, i) => <option key={i} id={c.id} value={c.categoria}>{c.categoria}</option>)}
                        </Input>
                        <Input type="text" placeholder="Categoria" onChange={(e) => setSubCategoria(e.target.value)} />
                    </FormGroup>
                </div>
                <Button onClick={() => agregarSubCategoria()} className="botonAmarillo w100">Crear</Button>
            </div>
            </Modal>
        </React.Fragment>
    );
}

export default ModalCategorias;
