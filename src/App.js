import React, { useContext } from "react";
import { Routes, Route, Navigate} from "react-router-dom"

import Inicio from './Components/InicioCatalogo/InicioCatalogo'

import Login from './Components/login/Login'
import Tasks from "./Components/Admin/tasks/Tasks";


import Usuario from "./Components/Admin/context/UsuarioContext";

function App() {

    const { usuarioLoggeado } = useContext(Usuario)


return (
		<React.Fragment>
			<div style={{ minHeight: '91px' }} />
			<Routes>
				<React.Fragment>
					{usuarioLoggeado && <>
						<Route path="/" element={<Navigate to="/tasks" />} />
						<Route path="/*" element={<Navigate to="/tasks" />} />
					</>}
					{!usuarioLoggeado && <>
						<Route path="/*" element={<Inicio/>}>
							<Route path="iniciar-sesion" element={<Login/>} />
						</Route>
						<Route path="admin/*" element={<Navigate to="/iniciar-sesion" />} />
						<Route path="/" element={<Navigate to="/tasks" />} />
						<Route path="/*" element={<Navigate to="/tasks" />} />
					</>}
					<>
						<Route path="tasks" element={<Tasks/>} />
					</>
				</React.Fragment>
			</Routes>
		</React.Fragment>
	);
}

export default App;