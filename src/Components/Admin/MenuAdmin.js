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
			nombre: "Faltan de subir",
			path: `/admin/por-subir`,
		},
		{
			nombre: "Producto solicitado",
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
