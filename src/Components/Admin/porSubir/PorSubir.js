import React, { useContext, useState } from "react";
import { Container, Input } from "reactstrap";
import ProductoPorSubir from "./ProductoPorSubir";
import UsuarioContext from "../context/UsuarioContext";
import Fuse from 'fuse.js'
import { FaExclamationTriangle } from 'react-icons/fa'


function PorSubir() {
    
    const {productos} = useContext(UsuarioContext)


    const [query, setQuery] = useState('')

    const fuse = new Fuse(productos, {
        keys: [{name:"nombre", weight: 0.4}, {name:"categoria", weight: 0.25}, {name:"sub-categoria", weight: 0.25}, {name:"propietario", weight: 0.1}],
        threshold: 0.5,
        includeScore: true,
        shouldSort: true,
      })
      
    const busqueda = fuse.search(query) 
    const productosFuse = query ? busqueda.map(resultado => resultado.item) : productos.sort((a, b) => (a.nombre > b.nombre) ? 1 : -1)

    return (
        <React.Fragment>
            <Container className="pabenorme">
                <div className="pargrande">
                <div className="pabmediano"><Input type="search" placeholder="Buscar producto" input={query} onChange={e => {setQuery(e.target.value)}} /></div>
                    {productosFuse.sort((a, b) => (a.nombre > b.nombre) ? 1 : -1).map((p, i) => 
                        <ProductoPorSubir key={i} p={p}  cambio={query.length} />
                    )}
                    {productosFuse.sort((a, b) => (a.nombre > b.nombre) ? 1 : -1).length <= 0 && 
                        (<div className="pizchico pabmediano  parchico"><FaExclamationTriangle className="amarillo tIconos" /> No encontramos resultados para tu busqueda.</div> 
                    )}
                </div>
            </Container>
        </React.Fragment>
    );
}

export default PorSubir;