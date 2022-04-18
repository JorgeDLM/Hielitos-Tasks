import React, { useEffect, useState } from "react"
import UsuarioContext from './UsuarioContext'
import { collection, getDocs, limit, orderBy, query, where  } from "firebase/firestore"
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
    const [categoria, setCategoria] = useState("")
    const [categorias, setCategorias] = useState([])
    const [subCategoria, setSubCategoria] = useState("")
    const [subCategorias, setSubCategorias] = useState([])

// USUARIO LOGGEADO
    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("infoUsuario"))
        userInfo ? setUsuarioLoggeado(true) : setUsuarioLoggeado(false)
        setUsuario(userInfo)
	}, []);    
    
// CARGAR PRODUCTOS-------------------------------------------------------
    useEffect(() => {
        const fetchProductos = async() => {
            try {
                const dataProductos = query(collection(db, "productos"), 
                where('activo', '==', true), 
                orderBy('nombre', 'asc'), 
                limit(20+(loadMore >= 5000 ? 5000 : loadMore)
                ))

                const querySnapshot = await getDocs(dataProductos);
                const getDataProductos = querySnapshot.docs.map((doc) => ({...doc.data(), id: doc.id}))   
                

                const ifProductosCache = productosCache ? productosCache : []
                const setCache = [ ...getDataProductos, ...ifProductosCache ]
                const unico = setCache.filter((value, index, self) =>
                index === self.findIndex((t) => (
                        t.id === value.id
                    ))
                )
                        
                localStorage.setItem('productosCache', JSON.stringify([...unico]))    
                setProductos(getDataProductos)

            } catch (error) {
                console.log(error)
            }
        }
        fetchProductos();
        setLoading(false)
        console.log("cargar más")
    }, [loadMore, productosCache])  

// CARGAR PRODUCTOSCACHE-------------------------------------------------------
    useEffect(() => {
        const productosCacheData = JSON.parse(localStorage.getItem("productosCache"))    
        setProductosCache(productosCacheData)
    }, [loadMore])

    
// FETCH CATEGORIAS
    useEffect(() => {
        const fetchCategorias = async() => {
            const dataCategoria =  await getDocs(collection(db, "categorias"))
            const data = dataCategoria.docs.map(doc => ({id: doc.id, ...doc.data()}))
            setCategorias(data)
        }
        fetchCategorias();
        setLoading(false)
        console.log("a")
    }, [setLoading])
    
// FETCH SUBCATEGORIAS
    useEffect(() => {
        const categoriaID = categorias?.filter(c => categoria === c.categoria)[0]?.id
        const set = async () => {
            const dataSubCategoria =  await getDocs(collection(db, "categorias", categoriaID, "sub_categorias"))
            const data = dataSubCategoria.docs.map(doc => ({id: doc.id, ...doc.data()}))
            setLoading(false)
            setSubCategorias(data)
        }
        if(categoria !== ""){
            set()
        }
        setLoading(false)
        
        console.log("b")
    }, [categoria, categorias, setLoading])


// CARGAR COMPRAS-------------------------------------------------------
useEffect(() => {
        const fetchCompras = async() => {
            try {
                const dataCompras = query(collection(db, "compras"), where("activa", "==", true), orderBy("timestamp", "asc"), limit(10))

                const querySnapshot = await getDocs(dataCompras);
                const getDataCompras = querySnapshot.docs.map((doc) => ({...doc.data(), id: doc.id}))   

                // const dataCompras =  await getDocs(collection(db, "compras"))
                // const getDataCompras = dataCompras.docs.map((doc) => ({...doc.data(), id: doc.id}))   
                setCompras( getDataCompras )
            } catch (error) {
                console.log(error)
            }
        }
        fetchCompras()
        
    }, [setCompras])

// CARGAR COMPRA STATE-------------------------------------------------------
    useEffect(() => {
        const infoProductosCompras = JSON.parse(localStorage.getItem("infoProductosCompras"))
            if (infoProductosCompras) {
                setProductosCompra( infoProductosCompras )
            }
            
        }, [setProductosCompra])


// CARGAR VENTAS-------------------------------------------------------
    useEffect(() => {
        const infoProductosVentas = JSON.parse(localStorage.getItem("infoProductosVentas"))
            if (infoProductosVentas) {
                setProductosVenta( infoProductosVentas )
            }
            
        }, [setProductosVenta])


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
            loadMore,
            categoria, 
            setCategoria,
            categorias, 
            setCategorias,
            subCategoria, 
            setSubCategoria,
            subCategorias, 
            setSubCategorias,
        }}>
            {props.children}
        </UsuarioContext.Provider>  
    )
}

export default UsuarioState;