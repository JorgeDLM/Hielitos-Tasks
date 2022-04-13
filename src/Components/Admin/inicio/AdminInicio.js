import React, { useContext, useState } from "react";
import { Container, Spinner, Input, Row, Button } from "reactstrap";
import ModalProducto from './ModalProducto'
import ModalCategorias from "./ModalCategorias";
import UsuarioContext from "../context/UsuarioContext";
import Fuse from 'fuse.js'
import { FaExclamationTriangle } from 'react-icons/fa'
import ProductoEditar from "./ProductoEditar";

function Admin() {
    
    const { productos, loading, setLoadMore, loadMore } = useContext(UsuarioContext)


    const [query, setQuery] = useState('')

    const fuse = new Fuse(productos, {
        keys: [{name:"nombre", weight: 0.25}, {name:"titulo", weight: 0.25}, {name:"categoria", weight: 0.20}, {name:"sub-categoria", weight: 0.20}, {name:"propietario", weight: 0.1}],
        threshold: 0.4,
        includeScore: true,
        shouldSort: true,
      })
      
    const busqueda = fuse.search(query) 
    const productosFuse = query ? busqueda.map(resultado => resultado.item) : productos.sort((a, b) => (a.nombre > b.nombre) ? 1 : -1)


    return (
        <React.Fragment>
            <Container className="pabenorme">
                        <div className="pargrande centro">
                            <ModalProducto />
                            <ModalCategorias />
                        </div>
                <div className="pargrande"><Input type="search" placeholder="Buscar producto" input={query} onChange={e => {setQuery(e.target.value); setLoadMore(3000)}} /></div>
                <div className="derecha pdechico gris t14">{productosFuse.length} resultados</div>
                    {loading ? <div className="centro parmediano azul"><Spinner /></div> :
                    <>
                        <div>
                            <div className="pargrande">
                                <Row className="parchico">
                                    {productosFuse.filter(prod => prod.activo).sort((a, b) => (a.nombre > b.nombre) ? 1 : -1).map((p, i) => 
                                        <ProductoEditar key={i} p={p}  cambio={query.length} />
                                    )}
                                </Row>

                                {loading ? <div className="centro parmediano azul"><Spinner /></div> :
                                <>
                                    {productosFuse.filter(a => a.activo).sort((a, b) => (a.nombre > b.nombre) ? 1 : -1).length <= 0 && 
                                        (<div className="pizchico pabmediano  parchico"><FaExclamationTriangle className="amarillo tIconos" /> No encontramos resultados para tu busqueda.</div> 
                                    )}
                                </>}
                            </div>
                        </div>
                        <div><Button className="botonAzul w100" onClick={() => setLoadMore(loadMore + 60)}>Cargar más</Button></div>
                    </>}
            </Container>
        </React.Fragment>
    );
}

export default Admin;
