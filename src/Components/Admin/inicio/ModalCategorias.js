import React, { useContext, useState } from "react";
import { Button, Modal, Input, FormGroup, Col } from "reactstrap";
import swal from 'sweetalert';
import logo from '../../../imgs/logoNegro.png'
import { FaPlus } from 'react-icons/fa'
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../../firebase-config';
import UsuarioContext from "../context/UsuarioContext";


function ModalCategorias() {
    const [modal, setModal] = useState(false)
    const [modal2, setModal2] = useState(false)
    const [categoria, setCategoria] = useState("")
    const [subCategoria, setSubCategoria] = useState("")
    const [codigo_universal, setCodigoUniversal] = useState("")
    const [loading2, setLoading2] = useState(true)
    const { categorias, loading } = useContext(UsuarioContext)



// SUBIR CATEGORIA ------------------------------------------------------------
const agregarCategoria = async() => {
    setLoading2(true);
    if(!categoria){
        swal({
            title: "Rellene el campo",
            text: "¿Te falta algo?",
            icon: "error",
            button: "cerrar"
        });
        setLoading2(false);
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
        setLoading2(false);
        setCategoria("")
        window.location.reload()

        } catch (error){
            swal({
                title: "Error",
                text: `No se ha podido subir la categoria, ${error.message}`,
                icon: "error",
                button: "cerrar"
            });
            setLoading2(false);
        
    }
}
// -----------------------------------------------------------------------------------
    
// SUBIR SUB-CATEGORIA ------------------------------------------------------------
const agregarSubCategoria = async() => {
    setLoading2(true);
    if(!categoria && !subCategoria){
        swal({
            title: "Rellene todos los campos",
            text: "¿Te falta algo?",
            icon: "error",
            button: "cerrar"
        });
        setLoading2(false);
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
        setLoading2(false);
        setCategoria("")
        window.location.reload()

        } catch (error){
            swal({
                title: "Error",
                text: `No se ha podido subir la sub-categoria, ${error.message}`,
                icon: "error",
                button: "cerrar"
            });
            setLoading2(false);
        
    }
}
// -----------------------------------------------------------------------------------

    return (
        <React.Fragment>
            <Col className="sinpymiz sinpymde"><Button onClick={() => setModal(!modal)} className="botonAmarillo tCategoria w100"><FaPlus className="tIconoCategoria" /> Categoria</Button></Col>
            <Col><Button onClick={() => setModal2(!modal2)} className="botonAzul tCategoria w100" disabled={loading}><FaPlus className="tIconoCategoria" /> <span className="d-none d-md-inline">Sub-categoria</span><span className="d-inline d-md-none">Sub</span></Button></Col>
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
                <Button className="botonAmarillo w100" onClick={() => {agregarCategoria(); setLoading2(true)}} disabled={loading2}>Crear</Button>
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
                        <Input type="text" placeholder="Sub categoria" onChange={(e) => setSubCategoria(e.target.value)} />
                    </FormGroup>
                </div>
                <Button onClick={() => {agregarSubCategoria(); setLoading2(true)}} disabled={loading2} className="botonAmarillo w100">Crear</Button>
            </div>
            </Modal>
        </React.Fragment>
    );
}

export default ModalCategorias;
