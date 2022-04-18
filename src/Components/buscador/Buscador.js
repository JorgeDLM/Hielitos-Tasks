import React, { useContext, useState } from "react";
import { Button, Input, Row, Spinner } from "reactstrap";
import Fuse from 'fuse.js'
import UsuarioContext from "../Admin/context/UsuarioContext";
import ProductoEditar from "../Admin/inicio/ProductoEditar";
import { FaExclamationTriangle, FaTrash } from 'react-icons/fa'
import ProductoCompras from "../Admin/compras/ProductoCompras";
import ProductoCatalogo from "../InicioCatalogo/ProductoCatalogo";
import ProductoPorSubir from "../Admin/porSubir/ProductoPorSubir";

function Buscador({categoria, subCategoria, setCategoria, setSubCategoria, inicio, compras, catalogo, porSubir}) {
    
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
    const largoBusqueda = productosFuse.filter(prod => (categoria ? prod.categoria === categoria : prod)).filter(prod => (subCategoria ? prod.sub_categoria === subCategoria : prod)).length
    
    const spinner = <div className="centro parmediano azul"><Spinner /></div>
    const spinnerSinResultados = <div className="centro azul t30"><Spinner /><span className="pizmediano">Cargando...</span></div>
    const botonLoadMore = loading ? spinner : largoBusqueda === (loadMore + 20) && <>{largoBusqueda >= 20 && <Button className="botonAzul w100 pabmediano parmediano t20" onClick={() => setLoadMore(loadMore + 60)}>Cargar más</Button>}</>
    const botonBorrarFiltros = ((categoria !== "" || subCategoria !== "") && <div><Button onClick={() => {setCategoria(""); setSubCategoria("")}} className="botonAmarilloComentario"><FaTrash className="tIconos" /></Button><span className="pizchico wbold">Filtros:</span> {categoria}{subCategoria && ` - ${subCategoria}`}</div>)

// ADMIN INICIO
    const filtradoInicioAdmin = inicio && (loading ? spinner :
        <>
            <div className="pabmuygrande">{botonBorrarFiltros}</div>
                <Row className="pabchico paddingIos">
                    {productosFuse.filter(prod => (categoria ? prod.categoria === categoria : prod)).filter(prod => (subCategoria ? prod.sub_categoria === subCategoria : prod)).map((p, i) => 
                        <ProductoEditar key={i} p={p}  cambio={query.length} />
                    )}
                    {(loading || ((productosFuse.length <= 0) && !query)) ? spinnerSinResultados :
                        <>
                            {productosFuse.length <= 0 && 
                                (<div className="pizchico pabmediano  parchico"><FaExclamationTriangle className="amarillo tIconos" /> No encontramos resultados para tu busqueda.</div> 
                            )}
                        </>
                    }
                </Row>
            {botonLoadMore}
        </>)
 
// CATALAGO
const filtradoCatalogo = catalogo && (
    <>
        <div className="pabmuygrande">{botonBorrarFiltros}</div>
        <Row className="pabchico">
            {productosFuse.filter(prod => (categoria ? prod.categoria === categoria : prod)).filter(prod => (subCategoria ? prod.sub_categoria === subCategoria : prod)).map((p, i) => 
                <ProductoCatalogo key={i} p={p} />
            )}
            {(loading || ((productosFuse.length <= 0) && !query)) ? spinnerSinResultados : 
                <>
                    {productosFuse.length <= 0 && 
                        (<div className="pizchico pabmediano  parchico"><FaExclamationTriangle className="amarillo tIconos" /> No encontramos resultados para tu busqueda.</div> 
                    )}
                    {botonLoadMore}
                </>
            }
        </Row>
    </>)

//  ADMIN COMPRAS
    const filtradoCompras = compras && (loading ? spinner :
        <>
           <div className="overflowProductosCompra">
                {productosFuse.map((p, i) => 
                    <ProductoCompras key={i} p={p}  cambio={query.length} />
                )}
                {botonLoadMore}
            </div>
            {(loading || ((productosFuse.length <= 0) && !query)) ? spinnerSinResultados : 
                <>
                    {productosFuse.length <= 0 && 
                        (<div className="pizchico pabmediano  parchico"><FaExclamationTriangle className="amarillo tIconos" /> No encontramos resultados para tu busqueda.</div> 
                    )}
                </>
            }
        </>)


// POR SUBIR
    const filtradoPorSubir = porSubir && ( 
        <div className="pargrande">
            {productosFuse.filter(prod => (categoria ? prod.categoria === categoria : prod)).filter(prod => (subCategoria ? prod.sub_categoria === subCategoria : prod)).map((p, i) => 
                <ProductoPorSubir key={i} p={p}  cambio={query.length} />
            )}
            {(loading || ((productosFuse.length <= 0) && !query)) ? spinnerSinResultados : <>
                {productosFuse.length <= 0 && 
                    (<div className="pizchico pabmediano  parchico"><FaExclamationTriangle className="amarillo tIconos" /> No encontramos resultados para tu busqueda.</div> 
                )}
                {botonLoadMore}
            </>}
        </div>
    )

    return (
        <React.Fragment>
                <div className="parchico"><Input type="search" placeholder="Buscar producto" input={query} onChange={e => {setQuery(e.target.value); setLoadMore(5000)}} /></div>
                <div className="derecha pdechico gris t14">{largoBusqueda} resultados</div>
                {filtradoInicioAdmin}
                {filtradoCompras}
                {filtradoCatalogo}
                {filtradoPorSubir}
        </React.Fragment>
    );
}

export default Buscador;
