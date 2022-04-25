import React, { useEffect, useState } from "react"
import UsuarioContext from './UsuarioContext'
import { collection, getDocs, limit, orderBy, query, where  } from "firebase/firestore"
import { db } from "../../../firebase-config"

const fetchProductosCliente = (doc, id) => {
    const datos = doc.data()
    return(
        {
            id,
            nombre: datos.nombre,
            titulo: datos.titulo,
            imagen: datos.imagen,
            imagen_mediana: datos.imagen_mediana,
            imagen_thumbnail: datos.imagen_thumbnail,
            categoria: datos.categoria,
            sub_categoria: datos.sub_categoria,
            tematica: datos.tematica,
            compuesto: datos.compuesto,
            precio_venta: datos.precio_venta,
            precio_venta_ml: datos.precio_venta_ml,
            precio_venta_mayoreo: datos.precio_venta_mayoreo,
            envio: datos.envio,
            medidas: datos.medidas,
            material: datos.material,
            descripcion: datos.descripcion,
            cantidad: datos.cantidad,
            codigo_universal: datos.codigo_universal,
            keywords: datos.keywords,
            ventas: datos.ventas,
            activo: datos.activo,
        }
    )
}
const fetchProductosSocio = (doc, id) => {
    const datos = doc.data()
    return(
        {
            id,
            nombre: datos.nombre,
            titulo: datos.titulo,
            imagen: datos.imagen,
            imagen_mediana: datos.imagen_mediana,
            imagen_thumbnail: datos.imagen_thumbnail,
            categoria: datos.categoria,
            sub_categoria: datos.sub_categoria,
            tematica: datos.tematica,
            compuesto: datos.compuesto,
            precio_venta: datos.precio_venta,
            precio_venta_ml: datos.precio_venta_ml,
            precio_venta_mayoreo: datos.precio_venta_mayoreo,
            envio: datos.envio,
            medidas: datos.medidas,
            material: datos.material,
            descripcion: datos.descripcion,
            cantidad: datos.cantidad,
            codigo_universal: datos.codigo_universal,
            keywords: datos.keywords,
            ventas: datos.ventas,
            activo: datos.activo,
            // DATA PRIVADA
            precio_compra: datos.precio_compra,
            cantidad_mínima: datos.cantidad_mínima,
            proveedor: datos.proveedor,
            propietario: datos.propietario,
            subido: datos.subido,
            subido_amazon: datos.subido_amazon,
            subido_facebook: datos.subido_facebook,
            codigo_producto: datos.codigo_producto,
            comentario: datos.comentario,
            link_compra: datos.link_compra,
        }
    )
} 

const UsuarioState = (props) => {
    
    const [loading, setLoading] = useState(true)
    const [usuario, setUsuario] = useState()
    const [usuarioLoggeado, setUsuarioLoggeado] = useState(localStorage.getItem("infoUsuario") !== null ? true : false)
    const [productos, setProductos] = useState([])
    const [productosCache, setProductosCache] = useState(JSON.parse(localStorage.getItem("productosCache"))  ? JSON.parse(localStorage.getItem("productosCache")) : [])
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
                const getDataProductosCliente = querySnapshot.docs.map((doc) => (fetchProductosCliente(doc, doc.id)))   
                const getDataProductosSocio = querySnapshot.docs.map((doc) => (fetchProductosSocio(doc, doc.id)))  
                
                const dataProductosLoggeado = usuarioLoggeado ? getDataProductosSocio : getDataProductosCliente 

                const ifProductosCache = productosCache ? productosCache : []
                const setCache = [ ...dataProductosLoggeado, ...ifProductosCache ]
                const unico = setCache.filter((value, index, self) =>
                index === self.findIndex((t) => (
                        t.id === value.id
                    ))
                )
                        
                localStorage.setItem('productosCache', JSON.stringify([...unico]))    
                setProductos(dataProductosLoggeado)

            } catch (error) {
                console.log(error)
            }
        }
        fetchProductos();
        setLoading(false)
        console.log("cargar más")
    }, [loadMore, productosCache, usuarioLoggeado])  

// CARGAR PRODUCTOSCACHE-------------------------------------------------------
    useEffect(() => {
        const productosCacheData = JSON.parse(localStorage.getItem("productosCache"))    
        setProductosCache(productosCacheData)
    }, [loadMore])

    
// FETCH CATEGORIAS
    useEffect(() => {
        const fetchCategorias = async() => {
            
            const dataCategorias = query(collection(db, "categorias"), orderBy("categoria", "asc"))
            
            const querySnapshot =  await getDocs(dataCategorias)
            const data = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}))
            setCategorias(data)
        }
        fetchCategorias();
        setLoading(false)
    }, [setLoading])
    
// FETCH SUBCATEGORIAS
    useEffect(() => {
        const categoriaID = categorias?.filter(c => categoria === c.categoria)[0]?.id
        const set = async () => {
            const dataSubCategorias = query(collection(db, "categorias", categoriaID, "sub_categorias"), orderBy("sub_categoria", "asc"))
            
            const querySnapshot =  await getDocs(dataSubCategorias)
            // const dataSubCategoria =  await getDocs(collection(db, "categorias", categoriaID, "sub_categorias"))
            const data = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}))
            setLoading(false)
            setSubCategorias(data)
        }
        if(categoria !== ""){
            set()
        }
        setLoading(false)
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