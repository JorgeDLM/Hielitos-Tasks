import React, { useContext, useState } from "react";
import { Button, Modal,  } from "reactstrap";
import NumberFormat from "react-number-format";


import UsuarioContext from "../context/UsuarioContext";

function ModalTicketCompra(props) {
    
    const {productos} = useContext(UsuarioContext)

    const [modal, setModal] = useState(false)


    return (
        <React.Fragment>
            <Button className="wbold botonBlancoComentario" onClick={() => setModal(!modal)}>Ver ticket</Button>
                               
            {/* MODAL TICKET */}
            <Modal isOpen={modal} toggle={() => setModal(!modal)}>
                <div className="pgrande">
                    <div className="wbold t18">TICKET</div>
                    <hr />
                    <div className="gris">
                        {props.c.productos.map((p, i) => <div key={i} className="t13 pabmuychico"><span className="wbold t15">{p.cantidad}</span> x {productos.filter(prod => prod.id ===  p.producto)[0]?.nombre}
                        <span className="pizmuychico">(<NumberFormat displayType={'text'} thousandSeparator={true} prefix={'$'} value={p.precio_compra} /> x pza)</span>
                        <span className="wbold pizmuychico">- <NumberFormat displayType={'text'} thousandSeparator={true} prefix={'$'} value={p.precio_compra * p.cantidad} /></span>
                        </div>)}
                    </div>
                    <div className="wbold derecha t20">Total: <NumberFormat displayType={'text'} thousandSeparator={true} prefix={'$'} value={props.c.monto} /></div>
                    <hr />
                    <div className="derecha"><Button onClick={() => setModal(!modal)} className="botonRojo">Cerrar</Button></div>
                </div>                                  
            </Modal>
        </React.Fragment>
    );
}

export default ModalTicketCompra;
