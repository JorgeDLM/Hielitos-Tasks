import React, { useContext, useState } from "react";
import { Button, Card, Container, Input } from "reactstrap";
import ProductoVentas from "./ProductoVentas";
import UsuarioContext from "../context/UsuarioContext";
import Fuse from 'fuse.js'
import { FaExclamationTriangle, FaPlus, FaMinus } from 'react-icons/fa'


function Ventas() {
    
    const {productos} = useContext(UsuarioContext)


    const [query, setQuery] = useState('')
    const [nueva, setNueva] = useState(false)

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
                <div className="pargrande w100"><Button className="botonAzul w100" onClick={() => setNueva(!nueva)}>{nueva ? <FaMinus className="tIconos" /> : <FaPlus className="tIconos" />}</Button></div>
                {nueva && <div className="pargrande">
                <div className="pabmediano"><Input type="search" placeholder="Buscar producto" input={query} onChange={e => {setQuery(e.target.value)}} /></div>
                    {productosFuse.sort((a, b) => (a.nombre > b.nombre) ? 1 : -1).map((p, i) => 
                        <ProductoVentas key={i} p={p}  cambio={query.length} />
                    )}
                    {productosFuse.sort((a, b) => (a.nombre > b.nombre) ? 1 : -1).length <= 0 && 
                        (<div className="pizchico pabmediano  parchico"><FaExclamationTriangle className="amarillo tIconos" /> No encontramos resultados para tu busqueda.</div> 
                    )}
                </div>}
                <div className="wbold pargrande pabenorme t20">Ventas:</div>
                <Card className="pmediano">
                    Hola
                </Card>
            </Container>
        </React.Fragment>
    );
}

export default Ventas;
