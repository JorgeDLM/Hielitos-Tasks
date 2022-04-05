import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom"

import Admin from './Components/Admin/Admin'
import AdminInicio from './Components/Admin/inicio/AdminInicio'
import Inventario from './Components/Admin/inventario/Inventario'
import Login from './Components/login/Login'
import Inicio from './Components/Inicio/Inicio'
import Catalogo from './Components/Inicio/Catalogo'

import Usuario from "./Components/Admin/context/UsuarioContext";

function App() {

    const { usuarioLoggeado } = useContext(Usuario)



return (
		<React.Fragment>
			<div style={{ minHeight: '91px' }} />
			<Routes>
				<React.Fragment>
					{usuarioLoggeado && <>
						<Route path="admin/*" element={<Admin/>}  >
							<Route path="inicio" element={<AdminInicio/>} />
							<Route path="inventario" element={<Inventario/>} />
						</Route>
						<Route path="/*" element={<Navigate to="/admin/inicio" />} />
						<Route path="/" element={<Navigate to="/admin/inicio" />} />
					</>}
					{!usuarioLoggeado && <>
						<Route path="/*" element={<Inicio/>}>
							<Route path="catalogo" element={<Catalogo/>} />
							<Route path="iniciar-sesion" element={<Login/>} />
						</Route>
						<Route path="/*" element={<Navigate to="/catalogo" />} />
						<Route path="admin/*" element={<Navigate to="/iniciar-sesion" />} />
					</>}
				</React.Fragment>
			</Routes>
		</React.Fragment>
	);
}

export default App;