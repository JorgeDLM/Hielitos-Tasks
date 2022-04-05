import React from "react";
import { Outlet } from "react-router-dom";
import { Container } from "reactstrap";
import Menu from "../menu/Menu";


function InicioCatalogo() {

	const links = [
		{
			nombre: "Catálogo",
			path: `/catalogo`,
		},
	];

    return (
        <React.Fragment>
            <Menu links={links} logoNegro  />
			<Container className="parmediano pabenorme">
				<Outlet />
			</Container>
        </React.Fragment>
    );
}

export default InicioCatalogo;
