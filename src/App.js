import React from "react";
import { Routes, Route, Navigate } from "react-router-dom"


import Admin from './Components/Admin/Admin'
import AdminInicio from './Components/Admin/inicio/AdminInicio'
import Inventario from './Components/Admin/inventario/Inventario'
// import Usuario from "./Components/Admin/context/UsuarioContext";

function App() {

    // const { loading } = useContext(Usuario)



return (
		<React.Fragment>
			<div style={{ minHeight: '91px' }} />
			<Routes>
				<React.Fragment>
					<Route path="/*" element={<Admin/>}  >
						<Route path="inicio" element={<AdminInicio/>} />
						<Route path="inventario" element={<Inventario/>} />
					</Route>
					<Route path="/*" element={<Navigate to="/inicio" />} />
					<Route path="/" element={<Navigate to="/inicio" />} />
				</React.Fragment>
			</Routes>
		</React.Fragment>
	);
}

export default App;