import React, { useState } from "react";
import { Button, Input } from "reactstrap";
import { FaPlus } from 'react-icons/fa'

function Comentario(props) {

    const [areaComentario, setAreaComentario] = useState(false)


    return (
        <React.Fragment>
            <span className="wbold">Comentario:</span> <Button className="botonAmarilloComentario" 
                onClick={() => setAreaComentario(!areaComentario)}><FaPlus className="tIconos t12" /></Button>
            {areaComentario && <div className="parmuychico">
                <Input type="textarea" 
                        rows={3} 
                        className="letraChicaInput3 inputComentarios" 
                        placeholder={props.c.comentario ? props.c.comentario : "Comentario"} 
                        onChange={e => props.setComentario(e.target.value)}  />
            </div>}
        </React.Fragment>
    );
}

export default Comentario;
