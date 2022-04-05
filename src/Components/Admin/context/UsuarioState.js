import React, { useEffect, useState } from "react"
import UsuarioContext from './UsuarioContext'
import { collection, getDocs } from "firebase/firestore"
import { db } from "../../../firebase-config"

const UsuarioState = (props) => {
    
    const [loading, setLoading] = useState(true)
    const [productos, setProductos] = useState([])
    const [usuario, setUsuario] = useState()
    const [usuarioLoggeado, setUsuarioLoggeado] = useState(localStorage.getItem("infoUsuario") !== null ? true : false)

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
              const getDataProductos = dataProductos.docs.map((doc) => ({...doc.data()}))      
              setProductos(getDataProductos)
              setLoading(false)
            }
        fetchProductos();
      }, [])
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
        }}>
            {props.children}
        </UsuarioContext.Provider>  
    )
}

export default UsuarioState;