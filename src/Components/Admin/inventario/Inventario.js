import React, { useContext } from "react";
import { Container } from "reactstrap";
import Producto from "./Producto";
import UsuarioContext from "../context/UsuarioContext";


function Inventario() {

    const {productos} = useContext(UsuarioContext)

    return (
        <React.Fragment>
            <Container className="pabenorme">
                <div className="pargrande">
                    {productos.map((p, i) => (
                        <Producto key={i} p={p} />
                    ))}
                </div>
            </Container>
        </React.Fragment>
    );
}

export default Inventario;
