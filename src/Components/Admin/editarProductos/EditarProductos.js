import React, { useContext, useState } from "react";
import { Container, Input, Row } from "reactstrap";
import ProductoEditar from "./ProductoEditar";
import Fuse from 'fuse.js';

import UsuarioContext from "../context/UsuarioContext";
function EditarProductos() {
    
    const { productos } = useContext(UsuarioContext)

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
                <div className="pabmediano pargrande"><Input type="search" placeholder="Buscar producto" input={query} onChange={e => {setQuery(e.target.value)}} /></div>
                   <Row className="parchico">
                        {productosFuse.sort((a, b) => (a.nombre > b.nombre) ? 1 : -1).map((p, i) => 
                            <ProductoEditar key={i} p={p}  cambio={query.length} />
                        )}
                   </Row>
            </Container>

        </React.Fragment>
    );
}

export default EditarProductos;
