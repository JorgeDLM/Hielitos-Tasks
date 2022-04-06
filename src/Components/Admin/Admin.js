import React from "react";
import { Outlet } from "react-router-dom";
import Menu from "../menu/Menu";
// import UsuarioContext from "./context/UsuarioContext";


function Admin() {
	
	// const { loading } = useContext(UsuarioContext)


	const links = [
		{
			nombre: "Inicio",
			path: `inicio`,
		},
		{
			nombre: "Inventario",
			path: `inventario`,
		},
		{
			nombre: "Ventas",
			path: `ventas`,
		},
		{
			nombre: "Compras",
			path: `compras`,
		},
		{
			nombre: "Faltan de subir",
			path: `por-subir`,
		},
		{
			nombre: "Editar productos",
			path: `editar-productos`,
		},

	];

    return (
        <>
			<Menu links={links} logoNegro  />
			<>
				<Outlet/>
			</>
        </>
    );
}

export default Admin;
