import React, { useContext } from "react";
import { Routes, Route, Navigate} from "react-router-dom"

import Inicio from './Components/InicioCatalogo/InicioCatalogo'
// import Catalogo from './Components/InicioCatalogo/Catalogo'
// import ProductoID from "./Components/InicioCatalogo/ProductoID";

import Login from './Components/login/Login'

import Admin from './Components/Admin/Admin'
import InicioAdmin from './Components/Admin/inicio/InicioAdmin'
// import Inventario from './Components/Admin/inventario/Inventario'
// import Ventas from './Components/Admin/ventas/Ventas'
// import PorSubir from './Components/Admin/porSubir/PorSubir'
// import Compras from './Components/Admin/compras/Compras'
// import ProductoEditarID from "./Components/Admin/inicio/ProductoEditarID";
// import AlmightySupplier from "./Components/AlmightySupplier/AlmightySupplier";

import Usuario from "./Components/Admin/context/UsuarioContext";
// import ProductoPublicarSimilarID from "./Components/Admin/inicio/ProductoPublicarSimilarID";
// import SolicitarProducto from "./Components/Admin/solicitarProducto/SolicitarProducto";
// import Contabilidad from "./Components/Admin/contabilidad/Contabilidad";
import Tasks from "./Components/Admin/tasks/Tasks";

function App() {

    const { usuarioLoggeado, productosCache } = useContext(Usuario)


return (
		<React.Fragment>
			<div style={{ minHeight: '91px' }} />
			<Routes>
				<React.Fragment>
					{usuarioLoggeado && <>
						<Route path="admin/*" element={<Admin/>}  >
							<Route path="inicio" element={<InicioAdmin/>} />
						</Route>
						{/* <Route path="/*" element={<Navigate to="/admin/inicio" />} /> */}
						<Route path="/" element={<Navigate to="/admin/inicio" />} />
						<Route path="/iniciar-sesion" element={<Navigate to="/admin/inicio" />} />
						<Route path="/inicio" element={<Navigate to="/admin/inicio" />} />
					</>}
					{!usuarioLoggeado && <>
						<Route path="/*" element={<Inicio/>}>
							<Route path="iniciar-sesion" element={<Login/>} />
						</Route>
						<Route path="admin/*" element={<Navigate to="/iniciar-sesion" />} />
						<Route path="/" element={<Navigate to="/catalogo" />} />
						<Route path="/*" element={<Navigate to="/catalogo" />} />
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