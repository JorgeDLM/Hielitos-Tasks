import React, { useContext } from "react";
import { Container } from "reactstrap";
import UsuarioContext from "../context/UsuarioContext";
import Buscador from "../../buscador/Buscador";
import Categorias from "../inicio/Categorias";


function Inventario() {
    
    const { categoria, setCategoria, categorias, subCategoria, setSubCategoria, subCategorias } = useContext(UsuarioContext)

 
    return (
        <React.Fragment>
            <Container className="pabenorme">
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
                    inventario
                    />
            </Container>
        </React.Fragment>
    );
}

export default Inventario;
