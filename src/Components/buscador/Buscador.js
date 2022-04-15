import React, { useContext, useState } from "react";
import { Button, Input, Row, Spinner } from "reactstrap";
import Fuse from 'fuse.js'
import UsuarioContext from "../Admin/context/UsuarioContext";
import ProductoEditar from "../Admin/inicio/ProductoEditar";
import { FaExclamationTriangle, FaTrash } from 'react-icons/fa'
import ProductoCompras from "../Admin/compras/ProductoCompras";

function Buscador({categoria, subCategoria, setCategoria, setSubCategoria, inicio, compras}) {
    
    const { productos, setLoadMore, loading, loadMore } = useContext(UsuarioContext)
    
    const [query, setQuery] = useState('')

    const fuse = new Fuse(productos, {
        keys: [
            {name:"nombre", weight: 0.3}, 
            {name:"titulo", weight: 0.1}, 
            {name:"tematica", weight: 0.10}, 
            {name:"categoria", weight: 0.25}, 
            {name:"sub_categoria", weight: 0.05}, 
            {name:"propietario", weight: 0.1}
        ],
        threshold: 0.4,
        includeScore: true,
        shouldSort: true,
      })
      
    const busqueda = fuse.search(query) 
    const productosFuse = query ? busqueda.sort((a, b) => (a.score > b.score) ? 1 : -1).map(resultado => resultado.item) : productos.sort((a, b) => (a.nombre > b.nombre) ? 1 : -1)
    
    const spinner = <div className="centro parmediano azul"><Spinner /></div>
    const botonLoadMore = loading ? <div className="centro azul"><Spinner /></div> : <>{productosFuse.length >= 20 && <Button className="botonAzul w100 pabmediano parmediano t20" onClick={() => setLoadMore(loadMore + 60)}>Cargar más</Button>}</>

    
    const filtradoInicioAdmin = inicio && (loading ? spinner :
        <>
            <div>
                {(categoria !== "" || subCategoria !== "") && <div><Button onClick={() => {setCategoria(""); setSubCategoria("")}} className="botonAmarilloComentario"><FaTrash className="tIconos" /></Button><span className="pizchico wbold">Filtros:</span> {categoria}{subCategoria && ` - ${subCategoria}`}</div>}
                <div className="pargrande">
                    <Row className="parchico">
                        {productosFuse.filter(prod => (categoria ? prod.categoria === categoria : prod)).filter(prod => (subCategoria ? prod.sub_categoria === subCategoria : prod)).map((p, i) => 
                            <ProductoEditar key={i} p={p}  cambio={query.length} />
                        )}
                    </Row>

                    {loading ? spinner :
                    <>
                        {productosFuse.length <= 0 && 
                            (<div className="pizchico pabmediano  parchico"><FaExclamationTriangle className="amarillo tIconos" /> No encontramos resultados para tu busqueda.</div> 
                        )}
                    </>}
                </div>
            </div>
            {botonLoadMore}
        </>)
 
    const filtradoCompras = compras && (loading ? spinner :
        <>
           <div className="overflowProductosCompra">
                {productosFuse.map((p, i) => 
                    <ProductoCompras key={i} p={p}  cambio={query.length} />
                )}
                {botonLoadMore}
            </div>
            {productosFuse.sort((a, b) => (a.nombre > b.nombre) ? 1 : -1).length <= 0 && 
                (<div className="pizchico pabmediano  parchico"><FaExclamationTriangle className="amarillo tIconos" /> No encontramos resultados para tu busqueda.</div> 
            )}
        </>)

    return (
        <React.Fragment>
                <div className="parchico"><Input type="search" placeholder="Buscar producto" input={query} onChange={e => {setQuery(e.target.value); setLoadMore(5000)}} /></div>
                <div className="derecha pdechico gris t14">{productosFuse.filter(prod => (categoria ? prod.categoria === categoria : prod)).filter(prod => (subCategoria ? prod.sub_categoria === subCategoria : prod)).length} resultados</div>
                {filtradoInicioAdmin}
                {filtradoCompras}
        </React.Fragment>
    );
}

export default Buscador;
