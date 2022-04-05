import React, { useContext } from "react";
import { Card, Row, Col } from 'reactstrap'
import UsuarioContext from "../Admin/context/UsuarioContext";


function Catalogo() {


    const {productos} = useContext(UsuarioContext)
    return (
        <React.Fragment>
        Catálogo:
			<Row className="pabchico">
                {productos.map((p,i) => 
			        <Col className="pabchico">
                        <Card className="pmediano claseCard widthCardProveedor" key={i}>{p.nombre.toUpperCase()}</Card>
                    </Col>
                )}
            </Row>
        </React.Fragment>
    );
}

export default Catalogo;
