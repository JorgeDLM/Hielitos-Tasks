import React, { useContext, useState } from "react";
import { Input, InputGroup, Spinner } from "reactstrap";
import swal from "sweetalert";
import UsuarioContext from "../context/UsuarioContext";
import { db } from "../../../firebase-config";
import { doc, updateDoc } from "firebase/firestore";

function Estado(props) {

    const {setLoading, compras, setCompras, loading} = useContext(UsuarioContext)

    const [estado, setEstado] = useState(props.c.estado)


    const agregarEstado = async() => {
        if(!estado){
            swal({
                title: "Error",
                text: "Faltan de llenar campos, intente nuevamente.",
                icon: "error",
                button: "cerrar"
            });
        }
        setLoading(true)
        try {
            
            const dataC = {...props.c, estado: estado}
            const setearEstado = {...compras[props.i].estado = estado}
            console.log(setearEstado)
            
            await updateDoc(doc(db, "compras", props.c.id), dataC)
            setCompras([...compras])
            localStorage.setItem('infoCompras', JSON.stringify([...compras]))
            setLoading(false)
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
            <div className="wbold pdemuychico d-inline">Estado:</div> 
            {loading ? <Spinner className="gris" size="sm" /> : <InputGroup className="d-inline">
                    <Input type="select" 
                        className="letraChicaInput3 inputComentarios d-inline w50" 
                        defaultValue={props.c.estado}
                        onBlur={() => agregarEstado()}
                        onChange={e => setEstado(e.target.value)}  >
                            <option value="Por recibir">Por recibir</option>
                            <option value="Entregado">Entregado</option>
                            <option value="Entregado con problema">Entregado con problema</option>
                            <option value="Por pagar">Por pagar</option>
                    </Input>
                </InputGroup>}
        </React.Fragment>
    );
}

export default Estado;
