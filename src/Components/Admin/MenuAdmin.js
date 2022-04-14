import React from "react";
import Menu from "../menu/Menu";


function MenuAdmin() {

	const links = [
		{
			nombre: "Inicio",
			path: `/admin/inicio`,
		},
		{
			nombre: "Inventario",
			path: `/admin/inventario`,
		},
		{
			nombre: "Compras",
			path: `/admin/compras`,
		},
		{
			nombre: "Ventas",
			path: `/admin/ventas`,
		},
		{
			nombre: "Por subir",
			path: `/admin/por-subir`,
		},
		{
			nombre: "Solicitudes",
			path: `/solicitar`,
		},

	];

    return (
        <>
			<Menu links={links} logoNegro  />
        </>
    );
}

export default MenuAdmin;
