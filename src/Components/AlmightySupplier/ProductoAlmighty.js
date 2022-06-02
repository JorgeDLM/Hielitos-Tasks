import React, { useContext, useEffect, useState } from "react";
import { Button, Card, Col, Input } from 'reactstrap'
import swal from "sweetalert";
import UsuarioContext from "../Admin/context/UsuarioContext";


function ProductoAlmighty(props) {
    const {productosAlmighty, setProductosAlmighty, setLoading, loading } = useContext(UsuarioContext)
    const [agregar, setAgregar] = useState(false)

    const palabras = props.p.nombre.split(" ");
    const nombre = palabras.map(p => ((p[0] !== undefined && p[0]?.toUpperCase()) === false ? "" : (p[0] !== undefined && p[0]?.toUpperCase())) + (p !== undefined && p.substring(1).toLowerCase()) + " ").join("")

    const [cantidad, setCantidad] = useState("")
    const [name, setNombre] = useState(nombre)
    
    const irID = () => {
        agregarProductos()
        setAgregar(!agregar);
    }

    useEffect(() => {
        localStorage.setItem('infoProductosAlmighty', JSON.stringify(productosAlmighty));
    }, [cantidad, productosAlmighty, setProductosAlmighty])
    
    // AGREGAR PRODUCTOS
    const agregarProductos = async(e) => {
        setLoading(true)
        try {
            const data =  [{ producto: props.p.id, cantidad: cantidad, imagen: props.p.imagen_mediana, nombre: name }]
            const index = productosAlmighty.findIndex(p => p.producto === props.p.id)

                if(e){
                    productosAlmighty.splice(index,1)
                    const dataProductos = [...productosAlmighty]
                    await setProductosAlmighty(dataProductos)
                    localStorage.setItem('infoProductosAlmighty', JSON.stringify(productosAlmighty));
                }
            
                if (index !== -1 && agregar){
                    productosAlmighty.splice(index,1)
                    const dataProductos = [...productosAlmighty]
                    await setProductosAlmighty(dataProductos)
                    localStorage.setItem('infoProductosAlmighty', JSON.stringify(productosAlmighty));
                }
                if (index !== -1 && !agregar){
                    productosAlmighty.splice(index,1)
                    const dataProductos = [...productosAlmighty, ...data]
                    await setProductosAlmighty(dataProductos)
                    localStorage.setItem('infoProductosAlmighty', JSON.stringify(productosAlmighty));
                }
                if (index === -1 && !agregar){
                    const dataProductos = [...productosAlmighty, ...data]
                    await setProductosAlmighty(dataProductos)
                    localStorage.setItem('infoProductosAlmighty', JSON.stringify(productosAlmighty));
                }

            setCantidad("")
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
 
    const productoExistente = agregar || productosAlmighty.find(p => p.producto === props.p.id)

    return (
        <Col className="pabmediano contenedor widthCardAlmightyCol">
            <Card className={`pmediano claseCard widthCardAlmighty centradoRelativo ${(productoExistente) && "fondoVerde"}`}>
                <div className="contenedor">
                    <img draggable="false" src={props.p.imagen_mediana} className="claseImagenCatalogo" alt="" />
                    <div className="gris centro pabmuychico">{!productoExistente ? <Input type="textarea" rows={4} placeholder={nombre} value={name} maxLength={60} onChange={(e) => setNombre(e.target.value)} /> : <div className="pargrande pabgrande">{name}</div>}</div>
                    <Button onClick={() => irID()} className={!productoExistente ? "botonAzul" : "botonRojo"}>{!productoExistente ? "Solicitar" : "Quitar"}</Button>
                </div>
            </Card>
        </Col>
    );
}

export default ProductoAlmighty;
