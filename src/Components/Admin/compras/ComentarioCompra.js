import React, { useContext, useState } from "react";
import { Button, Input, Spinner } from "reactstrap";
import { FaPlus, FaMinus, FaPen } from 'react-icons/fa'
import swal from "sweetalert";
import UsuarioContext from "../context/UsuarioContext";
import { db } from "../../../firebase-config";
import { doc, updateDoc } from "firebase/firestore";

function ComentarioCompra(props) {

    const {setLoading, compras, setCompras, loading} = useContext(UsuarioContext)

    const [areaComentario, setAreaComentario] = useState(false)
    const [comentario, setComentario] = useState("")


    const agregarComentario = async() => {
        if(!comentario){
            swal({
                title: "Error",
                text: "Faltan de llenar campos, intente nuevamente.",
                icon: "error",
                button: "cerrar"
            });
        }
        setLoading(true)
        try {
            
            const dataC = {...props.c, comentario: comentario}
            const setearComentario = {...compras[props.i].comentario = comentario}
            console.log(setearComentario)
            
            await updateDoc(doc(db, "compras", props.c.id), dataC)
            setCompras([...compras])
            localStorage.setItem('infoCompras', JSON.stringify([...compras]))
            setLoading(false)
            setAreaComentario(false)
        } catch (error) {
            swal({
                title: "Error",
                text: error.message,
                icon: "error",
                button: "cerrar"
            });
            setLoading(false)
        }
    }
    return (
        <React.Fragment>
            <span className="wbold">Comentario:</span><span className="gris"> {props.c.comentario ? props.c.comentario : ""}</span> <Button className="botonAmarilloComentario" 
                onClick={() => setAreaComentario(!areaComentario)}>{props.c.comentario ? <FaPen className="tIconos t12"  /> : areaComentario ? <FaMinus className="tIconos t12" /> : <FaPlus className="tIconos t12" />}</Button>
            {areaComentario && <div className="parmuychico">
                {loading ? <Spinner className="gris" size="sm" /> : <Input type="textarea" 
                        rows={3} 
                        className="letraChicaInput3 inputComentarios" 
                        defaultValue={props.c.comentario ? props.c.comentario : ""}
                        placeholder={props.c.comentario ? props.c.comentario : "Comentario"} 
                        onBlur={() => agregarComentario()}
                        onChange={e => setComentario(e.target.value)}  />}
            </div>}
        </React.Fragment>
    );
}

export default ComentarioCompra;
