import React, { useContext } from "react";
import { Container } from "reactstrap";
import ModalProducto from './ModalProducto'
import ModalCategorias from "./ModalCategorias";
import Producto from "../productos/Producto";
import UsuarioContext from "../context/UsuarioContext";


function Admin() {

    const { productos } = useContext(UsuarioContext)

    return (
        <React.Fragment>
            <Container className="pabenorme">
                <div className="pargrande">
                    <ModalProducto />
                    <ModalCategorias />
                </div>
                <div>
                    <div className="pargrande">

                    {productos?.map((p, i) => (
                        <Producto key={i} p={p} />
                    ))}
                    </div>
                </div>
            </Container>
        </React.Fragment>
    );
}

export default Admin;
