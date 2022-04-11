import React, { useContext, useState } from "react";
import { Row, Input } from 'reactstrap'
import UsuarioContext from "../Admin/context/UsuarioContext";
import ProductoCatalogo from "./ProductoCatalogo";
import Fuse from 'fuse.js'
import { FaExclamationTriangle } from 'react-icons/fa'


function Catalogo() {
    
    const {productos} = useContext(UsuarioContext)


    const [query, setQuery] = useState('')

    const fuse = new Fuse(productos, {
        keys: [{name:"nombre", weight: 0.4}, {name:"categoria", weight: 0.3}, {name:"sub-categoria", weight: 0.3}],
        threshold: 0.5,
        includeScore: true,
        shouldSort: true,
      })
      
    const busqueda = fuse.search(query) 
    const productosFuse = query ? busqueda.map(resultado => resultado.item) : productos.sort((a, b) => (a.nombre > b.nombre) ? 1 : -1)

    return (
        <React.Fragment>
        
            <div className="pabmediano"><Input type="search" placeholder="Buscar producto" input={query} onChange={e => {setQuery(e.target.value)}} /></div>
			<Row className="pabchico">
                {productosFuse.filter(a => a.activo).sort((a, b) => (a.nombre > b.nombre) ? 1 : -1).map((p, i) => 
                    <ProductoCatalogo key={i} p={p} />
                )}
                {productosFuse.filter(a => a.activo).sort((a, b) => (a.nombre > b.nombre) ? 1 : -1).length <= 0 && 
                    (<div className="pizchico pabmediano  parchico"><FaExclamationTriangle className="amarillo tIconos" /> No encontramos resultados para tu busqueda.</div> 
                )}
            </Row>
        </React.Fragment>
    );
}

export default Catalogo;
