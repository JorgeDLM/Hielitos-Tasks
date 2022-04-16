import React, { useContext, useEffect, useState } from "react";
import { Container, Spinner, Input, Row, Col } from "reactstrap";
import ModalProducto from './ModalProducto'
import ModalCategorias from "./ModalCategorias";
import UsuarioContext from "../context/UsuarioContext";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase-config";
import Buscador from "../../buscador/Buscador";

function InicioAdmin() {
    
    const { loading, setLoadMore, setLoading } = useContext(UsuarioContext)


    const [categoria, setCategoria] = useState("")
    const [categorias, setCategorias] = useState([])
    const [subCategoria, setSubCategoria] = useState("")
    const [subCategorias, setSubCategorias] = useState([])

    
    // FETCH CATEGORIAS
    useEffect(() => {
        const fetchCategorias = async() => {
            const dataCategoria =  await getDocs(collection(db, "categorias"))
            const data = dataCategoria.docs.map(doc => ({id: doc.id, ...doc.data()}))
            setCategorias(data)
        }
        fetchCategorias();
        setLoading(false)
        console.log("a")
    }, [setLoading])
    
    
    
    // FETCH SUBCATEGORIAS
    useEffect(() => {
        const categoriaID = categorias?.filter(c => categoria === c.categoria)[0]?.id
        const set = async () => {
            const dataSubCategoria =  await getDocs(collection(db, "categorias", categoriaID, "sub_categorias"))
            const data = dataSubCategoria.docs.map(doc => ({id: doc.id, ...doc.data()}))
            setLoading(false)
            setSubCategorias(data)
        }
        if(categoria !== ""){
            set()
        }
        setLoading(false)
        
        console.log("b")
    }, [categoria, categorias, setLoading])
    

    return (
        <React.Fragment>
            <Container className="pabenorme">
                        <Row className="pargrande centro">
                            <Col>
                                <ModalProducto />
                            </Col>
                            <ModalCategorias />
                        </Row>

                <Row className="pargrande">
                    <Col>
                        <Input type="select" value={categoria} onChange={e => {setCategoria(e.target.value); setLoadMore(5000); setLoading(true); setSubCategoria("")}} >
                            <option value="">Categoria:</option>
                            {categorias?.map((c, i) => <option key={i}>{c.categoria}</option>)}
                        </Input>
                    </Col>
                    <Col>{loading ? <div className="centro"><Spinner className="azul" size="sm" /></div> : 
                        <Input disabled={!categoria} type="select" value={subCategoria} onChange={e => {setSubCategoria(e.target.value); setLoadMore(5000)}} >
                            <option value="">Sub categoria:</option>
                            {subCategorias?.map((c, i) => <option key={i}>{c.sub_categoria}</option>)}
                        </Input>}
                    </Col>
                </Row>
                <Buscador 
                    categoria={categoria} 
                    setCategoria={setCategoria}
                    subCategoria={subCategoria} 
                    setSubCategoria={setSubCategoria} 
                    inicio
                    />
            </Container>
        </React.Fragment>
    );
}

export default InicioAdmin;
