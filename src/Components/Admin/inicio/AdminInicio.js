import React, { useContext, useEffect, useState } from "react";
import { Container, Spinner, Input, Row, Button, Col } from "reactstrap";
import ModalProducto from './ModalProducto'
import ModalCategorias from "./ModalCategorias";
import UsuarioContext from "../context/UsuarioContext";
import Fuse from 'fuse.js'
import { FaExclamationTriangle, FaTrash } from 'react-icons/fa'
import ProductoEditar from "./ProductoEditar";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase-config";

function Admin() {
    
    const { productos, loading, setLoadMore, loadMore, setLoading } = useContext(UsuarioContext)


    const [categoria, setCategoria] = useState("")
    const [categorias, setCategorias] = useState([])
    // const [categoriasCache, setCategoriasCache] = useState([])
    const [subCategoria, setSubCategoria] = useState("")
    const [subCategorias, setSubCategorias] = useState([])
    const [query, setQuery] = useState('')



    
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
    
    const fuse = new Fuse(productos, {
        keys: [{name:"nombre", weight: 0.3}, {name:"titulo", weight: 0.2}, {name:"categoria", weight: 0.30}, {name:"sub_categoria", weight: 0.10}, {name:"propietario", weight: 0.1}],
        threshold: 0.4,
        includeScore: true,
        shouldSort: true,
      })
      
    const busqueda = fuse.search(query) 
    const productosFuse = query ? busqueda.sort((a, b) => (a.score > b.score) ? 1 : -1).map(resultado => resultado.item) : productos.sort((a, b) => (a.nombre > b.nombre) ? 1 : -1)


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
                        <Input type="select" value={subCategoria} onChange={e => {setSubCategoria(e.target.value); setLoadMore(5000)}} >
                            <option value="">Sub categoria:</option>
                            {subCategorias?.map((c, i) => <option key={i}>{c.sub_categoria}</option>)}
                        </Input>}
                    </Col>
                </Row>
                <div className="parchico"><Input type="search" placeholder="Buscar producto" input={query} onChange={e => {setQuery(e.target.value); setLoadMore(5000)}} /></div>
                <div className="derecha pdechico gris t14">{productosFuse.filter(prod => (categoria ? prod.categoria === categoria : prod)).filter(prod => (subCategoria ? prod.sub_categoria === subCategoria : prod)).length} resultados</div>
                    {loading ? <div className="centro parmediano azul"><Spinner /></div> :
                    <>
                        <div>
                            {(categoria !== "" || subCategoria !== "") && <div><Button onClick={() => {setCategoria(""); setSubCategoria("")}} className="botonAmarilloComentario"><FaTrash className="tIconos" /></Button><span className="pizchico wbold">Filtros:</span> {categoria}{subCategoria && ` - ${subCategoria}`}</div>}
                            <div className="pargrande">
                                <Row className="parchico">
                                    {productosFuse.filter(prod => (categoria ? prod.categoria === categoria : prod)).filter(prod => (subCategoria ? prod.sub_categoria === subCategoria : prod)).map((p, i) => 
                                        <ProductoEditar key={i} p={p}  cambio={query.length} />
                                    )}
                                </Row>

                                {loading ? <div className="centro parmediano azul"><Spinner /></div> :
                                <>
                                    {productosFuse.length <= 0 && 
                                        (<div className="pizchico pabmediano  parchico"><FaExclamationTriangle className="amarillo tIconos" /> No encontramos resultados para tu busqueda.</div> 
                                    )}
                                </>}
                            </div>
                        </div>
                        {loading ? <div className="centro azul"><Spinner /></div> : <>{productosFuse.length >= 20 && <Button className="botonAzul w100 pabmediano parmediano t20" onClick={() => setLoadMore(loadMore + 60)}>Cargar más</Button>}</>}
                    </>}
            </Container>
        </React.Fragment>
    );
}

export default Admin;
