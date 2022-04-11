import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom"

import Inicio from './Components/InicioCatalogo/InicioCatalogo'
import Catalogo from './Components/InicioCatalogo/Catalogo'
import ProductoID from "./Components/InicioCatalogo/ProductoID";

import Login from './Components/login/Login'

import Admin from './Components/Admin/Admin'
import AdminInicio from './Components/Admin/inicio/AdminInicio'
import Inventario from './Components/Admin/inventario/Inventario'
import Ventas from './Components/Admin/ventas/Ventas'
import PorSubir from './Components/Admin/porSubir/PorSubir'
import Compras from './Components/Admin/compras/Compras'
import ProductoEditarID from "./Components/Admin/inicio/ProductoEditarID";

import Usuario from "./Components/Admin/context/UsuarioContext";
import ProductoPublicarSimilarID from "./Components/Admin/inicio/ProductoPublicarSimilarID";

function App() {

    const { usuarioLoggeado, productos } = useContext(Usuario)

return (
		<React.Fragment>
			<div style={{ minHeight: '91px' }} />
			<Routes>
				<React.Fragment>
					{usuarioLoggeado && <>
						<Route path="admin/*" element={<Admin/>}  >
							<Route path="inicio" element={<AdminInicio/>} />
							<Route path="inventario" element={<Inventario/>} />
							<Route path="ventas" element={<Ventas/>} />
							<Route path="por-subir" element={<PorSubir/>} />
							<Route path="compras" element={<Compras/>} />
						</Route>
						{productos.map((p,i) => 
							<Route key={i} path={`editar/${p.id}`} element={<ProductoEditarID p={p} i={i} />} />
						)}
						{productos.map((p,i) => 
							<Route key={i} path={`publicar-similar/${p.id}`} element={<ProductoPublicarSimilarID p={p} i={i} />} />
						)}
						{/* <Route path="/*" element={<Navigate to="/admin/inicio" />} /> */}
						<Route path="/" element={<Navigate to="/admin/inicio" />} />
						<Route path="/iniciar-sesion" element={<Navigate to="/admin/inicio" />} />
						<Route path="/inicio" element={<Navigate to="/admin/inicio" />} />
						<Route path="/catalogo" element={<Navigate to="/admin/inicio" />} />
						<Route path="/catalogo/*" element={<Navigate to="/admin/inicio" />} />
					</>}
					{!usuarioLoggeado && <>
						<Route path="/*" element={<Inicio/>}>
							<Route path="catalogo" element={<Catalogo/>} />
							<Route path="iniciar-sesion" element={<Login/>} />
						</Route>
						<Route path="admin/*" element={<Navigate to="/iniciar-sesion" />} />
						<Route path="/" element={<Navigate to="/catalogo" />} />
						<Route path="/*" element={<Navigate to="/catalogo" />} />
						<Route path="/inicio" element={<Navigate to="/catalogo" />} />
						{productos.map((p,i) => 
							<Route key={i} path={`/catalogo/${p.id}`} element={<ProductoID p={p} />} />
						)}
					</>}
				</React.Fragment>
			</Routes>
		</React.Fragment>
	);
}

export default App;