import React from "react";
import { Outlet } from "react-router-dom";
import Menu from "../menu/Menu";
// import UsuarioContext from "./context/UsuarioContext";


function Admin() {
	
	// const { loading } = useContext(UsuarioContext)


	const links = [
		{
			nombre: "Inicio",
			path: `/inicio`,
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

	];

    return (
        <>
			<Menu links={links} logoNegro  />
			<div className="">
				<Outlet/>
			</div>
        </>
    );
}

export default Admin;
