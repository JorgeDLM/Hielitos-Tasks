import React, { useEffect, useState } from "react"
import UsuarioContext from './UsuarioContext'
import { collection, getDocs } from "firebase/firestore"
import { db } from "../../../firebase-config"

const UsuarioState = (props) => {
    
    const [loading, setLoading] = useState(true)
    const [productos, setProductos] = useState([])


// CARGAR PRODUCTOS-------------------------------------------------------
    const fetchProductos = async() => {
        const productosRef = collection(db, "productos")
        const dataProductos =  await getDocs(productosRef)
        setProductos(dataProductos.docs.map((doc) => ({id: doc.id, ...doc.data()})))
        setLoading(false)
      }
      useEffect(() => {
          fetchProductos();
      }, [])
// ------------------------------------------------------------------------

    return (
        <UsuarioContext.Provider value={{
            loading, 
            setLoading,
            productos, 
            setProductos
        }}>
            {props.children}
        </UsuarioContext.Provider>  
    )
}

export default UsuarioState;