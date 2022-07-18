import React from "react";
import Menu from "../menu/Menu";


function MenuAdmin() {

	const links = [
		{
			nombre: "Inicio",
			path: `/tasks`,
		},

	];

    return (
        <>
			<Menu links={links} logoNegro  />
        </>
    );
}

export default MenuAdmin;
