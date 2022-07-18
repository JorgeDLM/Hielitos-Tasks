import React, { useEffect, useState } from "react"
import UsuarioContext from './UsuarioContext'


const UsuarioState = (props) => {
    
    const [loading, setLoading] = useState(true)
    const [usuario, setUsuario] = useState()
    const [usuarioLoggeado, setUsuarioLoggeado] = useState(localStorage.getItem("infoUsuario") !== null ? true : false)
    // cache de almighty admin
    const [loadMore, setLoadMore] = useState(0)

// USUARIO LOGGEADO
    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("infoUsuario"))
        userInfo ? setUsuarioLoggeado(true) : setUsuarioLoggeado(false)
        setUsuario(userInfo)
	}, []);    
    

    return (
        <UsuarioContext.Provider value={{
            loading, 
            setLoading,
            usuario, 
            setUsuario,
            usuarioLoggeado, 
            setUsuarioLoggeado, 
            loadMore,
            setLoadMore
        }}>
            {props.children}
        </UsuarioContext.Provider>  
    )
}

export default UsuarioState;