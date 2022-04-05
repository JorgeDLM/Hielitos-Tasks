import React, { useEffect, useState } from "react"
import UsuarioContext from './UsuarioContext'
import { collection, getDocs } from "firebase/firestore"
import { db } from "../../../firebase-config"

const UsuarioState = (props) => {
    
    const [loading, setLoading] = useState(true)
    const [productos, setProductos] = useState([])


// CARGAR PRODUCTOS-------------------------------------------------------
    const fetchProductos = async() => {
        const dataProductos =  await getDocs(collection(db, "productos"))
        const getDataProductos = dataProductos.docs.map((doc) => ({...doc.data()}))      
        setProductos(getDataProductos)
      }
      useEffect(() => {
        fetchProductos();
      }, [productos])
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