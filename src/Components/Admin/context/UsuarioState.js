import React, { useEffect, useState } from "react"
import UsuarioContext from './UsuarioContext'
import { collection, getDocs } from "firebase/firestore"
import { db } from "../../../firebase-config"

const UsuarioState = (props) => {
    
    const [loading, setLoading] = useState(true)
    const [productos, setProductos] = useState([])
    const [usuario, setUsuario] = useState()
    const [usuarioLoggeado, setUsuarioLoggeado] = useState(localStorage.getItem("infoUsuario") !== null ? true : false)
    const [productosCompra, setProductosCompra] = useState([])
    const [productosVenta, setProductosVenta] = useState([])
    const [compras, setCompras] = useState([])

    // USUARIO LOGGEADO
    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("infoUsuario"))
        userInfo ? setUsuarioLoggeado(true) : setUsuarioLoggeado(false)
        setUsuario(userInfo)
	}, []);    
    
    // CARGAR PRODUCTOS-------------------------------------------------------
    useEffect(() => {
        const fetchProductos = async() => {
            const dataProductos =  await getDocs(collection(db, "productos"))
              const getDataProductos = dataProductos.docs.map((doc) => ({...doc.data(), id: doc.id}))      
              setProductos(getDataProductos)
              setLoading(false)
            }
        fetchProductos();
      }, [])
// ------------------------------------------------------------------------
// CARGAR COMPRAS-------------------------------------------------------
useEffect(() => {
    const infoCompras = JSON.parse(localStorage.getItem("infoCompras"))
        if (infoCompras.length >= 1) {
            setCompras( infoCompras )
        } else {
        const fetchCompras = async() => {
            const dataCompras =  await getDocs(collection(db, "compras"))
            const getDataCompras = dataCompras.docs.map((doc) => ({...doc.data(), id: doc.id}))   
            setCompras( getDataCompras )
            setLoading(false)
            }
            fetchCompras()
        }

        
    }, [setCompras])
// ------------------------------------------------------------------------
console.log(compras)
    // CARGAR COMPRA STATE-------------------------------------------------------
    useEffect(() => {
        const infoProductosCompras = JSON.parse(localStorage.getItem("infoProductosCompras"))
            if (infoProductosCompras) {
                setProductosCompra( infoProductosCompras )
            }
            
        }, [setProductosCompra])
// ------------------------------------------------------------------------
    // CARGAR VENTAS-------------------------------------------------------
    useEffect(() => {
        const infoProductosVentas = JSON.parse(localStorage.getItem("infoProductosVentas"))
            if (infoProductosVentas) {
                setProductosVenta( infoProductosVentas )
            }
            
        }, [setProductosVenta])
// ------------------------------------------------------------------------


    return (
        <UsuarioContext.Provider value={{
            loading, 
            setLoading,
            productos, 
            setProductos,
            usuario, 
            setUsuario,
            usuarioLoggeado, 
            setUsuarioLoggeado, 
            productosCompra, 
            setProductosCompra,
            productosVenta, 
            setProductosVenta, 
            compras, 
            setCompras,
        }}>
            {props.children}
        </UsuarioContext.Provider>  
    )
}

export default UsuarioState;