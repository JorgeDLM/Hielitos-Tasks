import React, { useContext } from "react";
import { Container, Spinner } from "reactstrap";
import ModalProducto from './ModalProducto'
import ModalCategorias from "./ModalCategorias";
import Producto from "../inventario/Producto";
import UsuarioContext from "../context/UsuarioContext";

function Admin() {

    const { loading, productos } = useContext(UsuarioContext)

    return (
        <React.Fragment>
            <Container className="pabenorme">
           {loading ? <div className="centro parmediano azul"><Spinner /></div> :
                <>
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
                </>}
            </Container>
        </React.Fragment>
    );
}

export default Admin;
