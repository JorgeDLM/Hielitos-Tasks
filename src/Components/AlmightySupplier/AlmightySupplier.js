import React, { useContext } from "react";
import { Container } from "reactstrap";
import UsuarioContext from "../Admin/context/UsuarioContext";
import Categorias from "../Admin/inicio/Categorias";
import Buscador from "../buscador/Buscador";
import Menu from "../menu/Menu";


function Admin() {
    const { usuarioLoggeado, categoria, setCategoria, categorias, subCategoria, setSubCategoria, subCategorias } = useContext(UsuarioContext)

	const links = [
		{
			nombre: "Catálogo",
			path: `/`,
		},
		{
			nombre: "Almighty",
			path: `/almighty-supplier`,
		},
	];

    return (
        <>
            <Menu iniciarsesion links={links} logoNegro  />
			<Container className="noselect">
                {usuarioLoggeado && 
                
                ( <>
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
                        almighty
                        />
                    </>)}
                        Hi friend, this is what i currently need to buy:

                    IF loggeado
                        Buscador
                        Producto (foto, nombre, y boton de agregar)
                    IF no loggeado
                        Arreglo de productos
                            If loggeado
                                trash
			</Container>
        </>
    );
}

export default Admin;
