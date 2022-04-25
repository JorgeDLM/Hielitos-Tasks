import React, { useContext } from "react";
import { Spinner, Input, Row, Col } from "reactstrap";
import UsuarioContext from "../context/UsuarioContext";

function Categorias({categoria, setCategoria, setSubCategoria, subCategoria, subCategorias, categorias}) {
    
    const { loading, setLoadMore, setLoading } = useContext(UsuarioContext)

  
    

    return (
        <React.Fragment>
            <Row className="pargrande">
                <Col>
                    <Input type="select" value={categoria} onChange={e => {setCategoria(e.target.value); setLoadMore(5000); setLoading(true); setSubCategoria("")}} >
                        <option value="">Categoria:</option>
                        {categorias?.map((c, i) => <option key={i}>{c.categoria}</option>)}
                    </Input>
                </Col>
                <Col>{loading ? <div className="centro"><Spinner className="azul" size="sm" /></div> : 
                    <Input disabled={!categoria || !subCategorias.length} type="select" value={subCategoria} onChange={e => {setSubCategoria(e.target.value); setLoadMore(5000)}} >
                        <option value="">Sub categoria:</option>
                        {subCategorias?.map((c, i) => <option key={i}>{c.sub_categoria}</option>)}
                    </Input>}
                </Col>
            </Row>
        </React.Fragment>
    );
}

export default Categorias;
