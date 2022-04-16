import React, { useContext, useEffect, useState } from "react";
import UsuarioContext from "../Admin/context/UsuarioContext";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase-config";
import Categorias from "../Admin/inicio/Categorias";
import Buscador from "../buscador/Buscador";


function Catalogo() {
    
    const { setLoading } = useContext(UsuarioContext)


    const [categoria, setCategoria] = useState("")
    const [categorias, setCategorias] = useState([])
    const [subCategoria, setSubCategoria] = useState("")
    const [subCategorias, setSubCategorias] = useState([])
    
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
    
    return (
        <React.Fragment>
            <Categorias 
                categoria={categoria}
                setCategoria={setCategoria}
                setSubCategoria={setSubCategoria}
                subCategoria={subCategoria}
                subCategorias={subCategorias}
                categorias={categorias}
            />
            <Buscador 
                categoria={categoria} 
                setCategoria={setCategoria}
                subCategoria={subCategoria} 
                setSubCategoria={setSubCategoria} 
                catalogo
                />
        </React.Fragment>
    );
}

export default Catalogo;
