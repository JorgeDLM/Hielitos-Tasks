import React, { useEffect, useState } from "react"
import UsuarioContext from './UsuarioContext'
import { collection, getDocs, limit, query, where  } from "firebase/firestore"
import { db } from "../../../firebase-config"

const UsuarioState = (props) => {
    
    const [loading, setLoading] = useState(true)
    const [productos, setProductos] = useState([])
    const [productosCache, setProductosCache] = useState(JSON.parse(localStorage.getItem("productosCache"))  ? JSON.parse(localStorage.getItem("productosCache")) : [])
    const [usuario, setUsuario] = useState()
    const [usuarioLoggeado, setUsuarioLoggeado] = useState(localStorage.getItem("infoUsuario") !== null ? true : false)
    const [productosCompra, setProductosCompra] = useState([])
    const [productosVenta, setProductosVenta] = useState([])
    const [compras, setCompras] = useState([])
    const [loadMore, setLoadMore] = useState(0)

    // USUARIO LOGGEADO
    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("infoUsuario"))
        userInfo ? setUsuarioLoggeado(true) : setUsuarioLoggeado(false)
        setUsuario(userInfo)
	}, []);    
    
    // CARGAR PRODUCTOS-------------------------------------------------------
    useEffect(() => {
        const fetchProductos = async() => {
            const dataProductos = query(collection(db, "productos"), where("activo", "==", true), limit(20+(loadMore >= 5000 ? 5000 : loadMore)))

            const querySnapshot = await getDocs(dataProductos);
            const getDataProductos = querySnapshot.docs.map((doc) => ({...doc.data(), id: doc.id}))   
            

            const ifProductosCache = productosCache ? productosCache : []
            const setCache = [ ...getDataProductos, ...ifProductosCache ]
            // const unico = setCache.filter((value, index, self) => index === self.findIndex((p) => {p.id === value.id && p.nombre === value.nombre}))
            const unico = setCache.filter((value, index, self) =>
                index === self.findIndex((t) => (
                    t.id === value.id
                ))
            )
            
            localStorage.setItem('productosCache', JSON.stringify([...unico]))    
            setProductos(getDataProductos)
        }
        fetchProductos();
        setLoading(false)
        console.log("cargar más")
    }, [loadMore, productosCache])
    console.log(productosCache)
    
    // localStorage.removeItem('productosCache')      

    // CARGAR PRODUCTOSCACHE-------------------------------------------------------
    useEffect(() => {
        const productosCacheData = JSON.parse(localStorage.getItem("productosCache"))    
        setProductosCache(productosCacheData)
    }, [loadMore])
// ------------------------------------------------------------------------


// CARGAR COMPRAS-------------------------------------------------------
// localStorage.removeItem("infoCompras")
useEffect(() => {
    // const infoCompras = JSON.parse(localStorage.getItem("infoCompras"))
    //     if (infoCompras && (infoCompras.length >= 1)) {
    //         setCompras( infoCompras )
    //     } else {
        const fetchCompras = async() => {
            const dataCompras =  await getDocs(collection(db, "compras"))
            const getDataCompras = dataCompras.docs.map((doc) => ({...doc.data(), id: doc.id}))   
            setCompras( getDataCompras )
            setLoading(false)
            }
            fetchCompras()
        // }
        // console.log(compras)

        
    }, [setCompras])
// ------------------------------------------------------------------------
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
            productosCache, 
            setProductosCache,
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
            setLoadMore,
            loadMore
        }}>
            {props.children}
        </UsuarioContext.Provider>  
    )
}

export default UsuarioState;