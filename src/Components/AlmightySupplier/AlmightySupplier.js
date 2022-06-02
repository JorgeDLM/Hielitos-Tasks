import React, { useContext, useState } from "react";
import { Button, Card, Col, Container, Row, Spinner } from "reactstrap";
import swal from "sweetalert";
import UsuarioContext from "../Admin/context/UsuarioContext";
import Categorias from "../Admin/inicio/Categorias";
import Buscador from "../buscador/Buscador";
import Menu from "../menu/Menu";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase-config";


function Admin() {
    const { usuarioLoggeado, categoria, setCategoria, categorias, subCategoria, setSubCategoria, subCategorias, productosAlmighty, setProductosAlmighty, almighty, setAlmighty, setLoading, loading } = useContext(UsuarioContext)

    const [show, setShow] = useState(false)

	const links = [
		{
			nombre: "Catálogo",
			path: `/`,
		},
		{
			nombre: "Almighty",
			path: `/almighty-supplier`,
		},
	];

     // SOLICITAR PRODUCTOS
     const solicitarProductos = async() => {
        setLoading(true)
        try {
            const data = {
                productos: productosAlmighty, 
            }
            await setDoc(doc(db, "almighty", "productosAlmighty"), data)
            setProductosAlmighty([])
            setAlmighty([data])
            // setAlmighty([...almighty, data])
            localStorage.setItem('infoAlmighty', JSON.stringify(data));
            localStorage.removeItem('infoProductosAlmighty')
            setLoading(false)
            swal({
                title: "Felicidades",
                text: "Solicitud creada con exito",
                icon: "success",
                button: "cerrar"
            });
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
        <>
            <Menu iniciarsesion links={links} logoNegro  />
			<Container className="noselect">
                {usuarioLoggeado && 
                    <>
                        <div className="centro parchico"><Button className={`${show ? "botonRojo" : "botonNegro"} w100`} onClick={() => setShow(!show)}>{show ? "Cerrar" : "Solicitar productos"}</Button></div>
                            {show && <>
                                <div className="centro parchico">
                                    <Button onClick={() => solicitarProductos()} className="botonVerde w100">Solicitar</Button>
                                </div>
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
                                    almighty
                                    />
                            </>}
                    </>
                }

                <div className="wbold t20 pabmediano parchico">Hi friend, this is what i currently need to buy:</div>
                {(loading || (almighty.length === 0)) ? <div className="centro"><Spinner /></div> : <Row>
                    {almighty.map(p => p.productos.map(prod => 
                        <Col className="pabmediano contenedor widthCardAlmightyCol2">
                            <Card className={`pmediano claseCard widthCardAlmighty2 centradoRelativo`}>
                                <div className="contenedor">
                                    <img draggable="false" src={prod.imagen} className="claseImagenCatalogo" alt="" /></div>
                                <div>{prod.nombre}</div>
                            {usuarioLoggeado && <Button className="botonRojo centrado">Borrar</Button>}
                            </Card>
                        </Col>
                    ))}
                </Row>}
			</Container>
        </>
    );
}

export default Admin;
