import React, { useContext } from "react";
import { Container, Row, Col } from "reactstrap";
import ModalProducto from './ModalProducto'
import ModalCategorias from "./ModalCategorias";
import UsuarioContext from "../context/UsuarioContext";
import Buscador from "../../buscador/Buscador";
import Categorias from "./Categorias";

function InicioAdmin() {
    
    const { categoria, setCategoria, categorias, subCategoria, setSubCategoria, subCategorias } = useContext(UsuarioContext)

    return (
        <React.Fragment>
            <Container className="pabenorme">
                <Row className="pargrande centro">
                    <Col>
                        <ModalProducto />
                    </Col>
                    <ModalCategorias />
                </Row>
                <Categorias 
                    categoria={categoria}
                    setCategoria={setCategoria}
                    setSubCategoria={setSubCategoria}
                    subCategoria={subCategoria}
                    subCategorias={subCategorias}
                    categorias={categorias}
                />
                <Buscador 
                    categoria={categoria} 
                    setCategoria={setCategoria}
                    subCategoria={subCategoria} 
                    setSubCategoria={setSubCategoria} 
                    inicio
                    />
            </Container>
        </React.Fragment>
    );
}

export default InicioAdmin;
