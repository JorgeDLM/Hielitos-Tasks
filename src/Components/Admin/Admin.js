import React from "react";
import { Outlet } from "react-router-dom";
import MenuAdmin from "./MenuAdmin";


function Admin() {

    return (
        <>
			<MenuAdmin  />
			<div className="noselect">
				<Outlet/>
			</div>
        </>
    );
}

export default Admin;
