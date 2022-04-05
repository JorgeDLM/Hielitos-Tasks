import React, { useContext } from "react";
import { Row } from 'reactstrap'
import UsuarioContext from "../Admin/context/UsuarioContext";
import ProductoCatalogo from "./ProductoCatalogo";


function Catalogo() {
    
    const {productos} = useContext(UsuarioContext)
    return (
        <React.Fragment>
			<Row className="pabchico">
                {productos.map((p,i) => 
			        <ProductoCatalogo key={i} p={p} />
                )}
            </Row>
        </React.Fragment>
    );
}

export default Catalogo;
