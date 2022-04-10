import React from "react";
import Menu from "../menu/Menu";


function MenuAdmin() {

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
			nombre: "Compras",
			path: `compras`,
		},
		{
			nombre: "Ventas",
			path: `ventas`,
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
        </>
    );
}

export default MenuAdmin;
