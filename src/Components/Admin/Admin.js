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
			nombre: "Productos",
			path: `productos`,
		},

	];

    return (
        <>
			<Menu links={links} logoNegro  />
			<div className="noselect">
				<Outlet/>
			</div>
        </>
    );
}

export default Admin;
