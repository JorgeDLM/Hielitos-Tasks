import React, { useContext, useEffect, useRef, useState } from "react";
import { Container, Card, Row, Col, Button, Input, FormGroup, FormFeedback, Spinner, InputGroup } from 'reactstrap'
import { FaChevronLeft } from 'react-icons/fa'
import { useNavigate } from "react-router-dom";
import UsuarioContext from "../context/UsuarioContext";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase-config";
// import swal from "sweetalert";
import MenuAdmin from "../MenuAdmin";
import swal from "sweetalert";
import Fuse from 'fuse.js'
import ProductoCompuesto from "./ProductoCompuesto";
import NumberFormat from "react-number-format";
import {FaSearch, FaExclamationTriangle, FaTrash} from 'react-icons/fa'


function ProductoEditarID(props) {
    
    const {loading, setLoading, productos} = useContext(UsuarioContext)

    const [imagen, setImagen] = useState(props.p.imagen)
    const [nombre, setNombre] = useState(props.p.nombre)
    const [titulo, setTitulo] = useState(props.p.titulo)
    const [categoria, setCategoria] = useState(props.p.categoria)
    const [subCategoria, setSubCategoria] = useState(props.p.sub_categoria ? props.p.sub_categoria : "")
    const [categorias, setCategorias] = useState([])
    const [subCategorias, setSubCategorias] = useState([])
    const [tematica, setTematica] = useState(props.p.tematica ? props.p.tematica : "")
    const [precio_compra, setPrecioCompra] = useState(props.p.precio_compra ? props.p.precio_compra : "")
    const [precio_venta, setPrecioVenta] = useState(props.p.precio_venta ? props.p.precio_venta : "")
    const [precio_venta_ml, setPrecioVentaML] = useState(props.p.precio_venta_ml ? props.p.precio_venta_ml : "")
    const [precio_venta_mayoreo, setPrecioVentaMayoreo] = useState(props.p.precio_venta_mayoreo ? props.p.precio_venta_mayoreo : "")
    const [envio, setEnvio] = useState(props.p.envio ? true : false)
    const [medidas, setMedidas] = useState(props.p.medidas ? props.p.medidas : "")
    const [material, setMaterial] = useState(props.p.material ? props.p.material : "")
    const [descripcion, setDescripcion] = useState(props.p.descripcion ? props.p.descripcion : "")
    // const [cantidad, setCantidad] = useState(props.p.cantidad ? props.p.cantidad : "")
    const [proveedor, setProveedor] = useState(props.p.proveedor ? props.p.proveedor : "")
    // const [propietario, setPropietario] = useState(props.p.propietario ? props.p.propietario : "")
    const [codigo_producto, setCodigoProducto] = useState(props.p.codigo_producto ? props.p.codigo_producto : "")
    const [codigo_universal, setCodigoUniversal] = useState(props.p.codigo_universal ? props.p.codigo_universal : "")
    // const [subido, setSubido] = useState(props.p.subido ? props.p.subido : "")
    const [cambio, setCambio] = useState(true)
    const [activo, setActivo] = useState(props.p.activo ? props.p.activo : false)
    
    
    const [compuesto, setCompuesto] = useState(props.p.compuesto ? props.p.compuesto : [])
    const [isCompuesto, setIsCompuesto] = useState((props.p.compuesto?.length >= 1) ? true : false)
    const [cambioCompuesto, setCambioCompuesto] = useState(false)
    const [query, setQuery] = useState("")



// Setear compuesto
    if(isCompuesto && !cambioCompuesto){
        console.log("true")
        setCambioCompuesto(true)

        setPrecioCompra("")
        setProveedor("")
        setCodigoProducto("")
        setCompuesto(props.p.compuesto ? props.p.compuesto : [])
    } else if (!isCompuesto && cambioCompuesto){
        console.log("false")
        setCambioCompuesto(false)
        setCompuesto([])
        setPrecioCompra(props.p.precio_compra)
        setProveedor(props.p.proveedor)
        setCodigoProducto(props.p.codigo_producto)
    }

    
    // CAMBIO PARA SABER SI EL ENVIO ES GRATIS O NO
    if (precio_venta >= 299 && cambio){
        setCambio(false)
    }
    if (precio_venta < 299 && !cambio){
        setCambio(true)
    }
    const total = (compuesto.length >= 1) && compuesto?.map(c => +c.cantidad * +productos.filter(p=> p.id === c.producto)[0]?.precio_compra)?.reduce((total, entrada) => (total += entrada))

    
    const precioInvalido = !isCompuesto ? ((precio_venta - precio_compra) <= 0) : false
    const precio_ventaInvalido = !isCompuesto ? (!precio_venta || (precioInvalido)) : !precio_venta
    const precio_venta_mlInvalido = !isCompuesto ? (!precio_venta_ml || ((precio_venta_ml - precio_compra) <= 0)) : false
    const precio_venta_mayoreoInvalido = !isCompuesto ? (!precio_venta_mayoreo || ((precio_venta_mayoreo - precio_compra) <= 0)) : false
    const productoCompuestoInvalido = isCompuesto ? compuesto?.length === 0 : false
    const precioEnvio = !isCompuesto ? ((precio_venta - precio_compra) < 70) : false
    const envioInvalido = envio === "" || precioEnvio

    const dataCompleta =  !precio_ventaInvalido && !envioInvalido && !precioInvalido && !precio_venta_mlInvalido && !productoCompuestoInvalido



    const navigate = useNavigate()
    const regresar = () => {
        navigate(`/admin/inicio`)
    }

        // FETCH CATEGORIAS
        useEffect(() => {
            const fetchCategorias = async() => {
                const dataCategoria =  await getDocs(collection(db, "categorias"))
                const data = dataCategoria.docs.map(doc => ({id: doc.id, ...doc.data()}))
                setCategorias(data)
            }
            fetchCategorias();
            setLoading(false)
        }, [setLoading])
    
        
        
        // FETCH SUBCATEGORIAS
        useEffect(() => {
            const categoriaID = categorias?.filter(c => categoria === c.categoria)[0]?.id
            if(categoriaID){
                const set = async () => {
                    const dataSubCategoria =  await getDocs(collection(db, "categorias", categoriaID, "sub_categorias"))
                    const data = dataSubCategoria.docs.map(doc => ({id: doc.id, ...doc.data()}))
                    setLoading(false)
                    setSubCategorias(data)
                }
                if(categoria !== ""){
                    set()
                }
            }
            setLoading(false)
            
            }, [categoria, categorias, setLoading])
    

    // Editar producto
    // const actualizarProducto = async() => {
    //     setLoading(true)
    //     const data = {...props.p}
    //     try {
    //         await updateDoc(doc(db, "productos", props.p.id), {data})
    //     } catch (error) {
    //         swal({
    //             title: "Error",
    //             text: error.message,
    //             icon: "error",
    //             button: "cerrar"
    //         });
    //         setLoading(false)
    //     }
    // }    

    const cardPrecio = (<Card className="pchico">
                                
                    
    {/* Precio de venta */}
        <>
            <div className="gris t14">*Precio de venta Mercadolibre:</div>
            <FormGroup>
                <Input
                    value={precio_venta_ml} 
                    placeholder="Precio de venta Mercadolibre" 
                    type="number" min={0} 
                    onChange={(e) => setPrecioVentaML(e.target.value)} 
                    invalid={precio_venta_mlInvalido} />
                {precioInvalido && <FormFeedback>El precio de venta debe ser mayor al precio de compra.</FormFeedback>}
            </FormGroup>
        </>

    {/* Precio de venta */}
        <>
            <div className="gris t14">*Precio de retial:</div>
            <FormGroup>
                <Input
                    value={precio_venta} 
                    placeholder="Precio de venta" 
                    type="number" min={0} 
                    onChange={(e) => setPrecioVenta(e.target.value)} 
                    invalid={precio_ventaInvalido} />
                {precioInvalido && <FormFeedback>El precio de venta debe ser mayor al precio de compra.</FormFeedback>}
            </FormGroup>
        </>

    {/* Precio de venta */}
        <>
            <div className="gris t14">*Precio de mayoreo:</div>
            <FormGroup>
                <Input
                    value={precio_venta_mayoreo} 
                    placeholder="Precio de venta" 
                    type="number" min={0} 
                    onChange={(e) => setPrecioVentaMayoreo(e.target.value)} 
                    invalid={precio_venta_mayoreoInvalido} />
                {precioInvalido && <FormFeedback>El precio de venta debe ser mayor al precio de compra.</FormFeedback>}
            </FormGroup>
        </>
        <hr />
        
    {/* Envio */}
        <>
                <div className="wbold t15 verdeObscuro">*Envío incluido:</div>
                <FormGroup>
                    <Input value={envio} type="select" onChange={(e) => setEnvio(e.target.value)} invalid={envioInvalido} >
                        <option value="" disabled={envio !== ""}>Seleccione:</option>
                        {precio_venta < 299 && <option value={false} >No</option>}
                        {precio_venta >= 250 && <option value={true}>Sí</option>}
                    </Input>
                    <FormFeedback>{`${precioEnvio ? "Muy poca ganancia valide nuevamente." : "¿Envío incluido en precio de venta?"}`}</FormFeedback>
                </FormGroup>
            </>
                        </Card>)
   
   
// EDITAR IMAGEN
    const inputFile = useRef(null) 
    const onButtonClick = () => {
        try {
            inputFile.current.click()
        }
        catch (error) {
            swal({
                title: "Error al subir la imagen",
                text: error.message,
                icon: "error",
                button: "Cerrar"
            });
            
        }
    }

// POST IMAGEN ---------------------------------------------------------------
    const postImagen = (img) => {
        setLoading(true)

        if(img === undefined){
            swal({
                title: "Te falto la imagen",
                text: "Checa de nuevo",
                icon: "warning",
                button: "Cerrar"
            })
        }

        if (img.type === "image/png" || img.type === "image/jpeg" || img.type === "image/jpg" || img.type === "image/webp"){
            const data = new FormData();
            data.append("file", img);
            data.append("upload_preset", "mercadoalamano");
            data.append("cloud_name",  "mercadoalamano");
            fetch("https://api.cloudinary.com/v1_1/mercadoalamano/image/upload", 
            {method: 'post', body: data}).then((res) => res.json())
            .then(data => {
                setImagen(data.url.toString());
                setLoading(false)
            })
            .catch((error) => {
                swal({
                    title: "Error al subir la imagen",
                    text: error.message,
                    icon: "error",
                    button: "Cerrar"
                });
                setLoading(false)
            })
        } else {
            swal({
                title: "Error al subir la imagen",
                text: "Intenta de nuevo",
                icon: "error",
                button: "Cerrar"
            });
            setLoading(false)
        }
    }


    
    

    
    const fuse = new Fuse(productos, {
        keys: [{name:"nombre", weight: 0.7}, {name:"categoria", weight: 0.15}, {name:"sub-categoria", weight: 0.1}, {name:"propietario", weight: 0.05}],
        threshold: 0.4,
        includeScore: true,
        shouldSort: true,
    })
    
    const busqueda = fuse.search(query) 
    const productosFuse = query ? busqueda.map(resultado => resultado.item) : productos.sort((a, b) => (a.nombre > b.nombre) ? 1 : -1)


    const dataFinal = {
        imagen: imagen ? imagen : props.p?.imagen,
        nombre: nombre ? nombre : props.p?.nombre,
        tematica: tematica ? tematica : props.p?.tematica,
        codigo_universal: categorias?.filter(c => categoria === c.categoria)[0]?.codigo_universal,
        categoria: categoria ? categoria : props.p?.categoria,
        sub_categoria: subCategoria ? subCategoria : props.p?.sub_categoria,
        precio_compra: !isCompuesto ? precio_compra : "",
        precio_venta: precio_venta ? precio_venta : props.p?.precio_venta,
        precio_venta_ml: precio_venta_ml ? precio_venta_ml : props.p?.precio_venta_ml,
        precio_venta_mayoreo: precio_venta_mayoreo ? precio_venta_mayoreo : props.p?.precio_venta_mayoreo,
        // envio: envio === "false" ? false : envio === "true" ? true  : props.p?.envio,
        medidas: medidas ? medidas : props.p?.medidas,
        material: material ? material : props.p?.material,
        descripcion: descripcion ? descripcion : props.p?.descripcion,
        // cantidad: cantidad ? cantidad : props.p?.cantidad,
        proveedor: !isCompuesto ? proveedor : "",
        // propietario: propietario ? propietario : props.p?.propietario,
        // subido: subido === "false" ? false : subido === "true" ? true : false,
        codigo_producto: !isCompuesto ? codigo_producto : "",
        compuesto: isCompuesto ? compuesto : [],
        // comentario: comentario ? comentario : props.p?.comentario,
    }
    console.log(dataFinal)
    console.log(dataCompleta)


    return (
        <React.Fragment>
            <MenuAdmin />
            <Container className="parmediano pabenorme noselect">
            <div className="parmediano pabmediano"><Button onClick={() => regresar()} className="botonTransparente azul"><FaChevronLeft className="tIconos" /> Volver</Button></div>
            <div className="wbold t25 pabgrande">{props.p.nombre}</div>

    {/* AREA 1 - Imagen - Nombre - Titulo - Precio Venta - Precio Venta ML - Precio Mayoreo - Envio */}
                <div className="pabmuygrande">
                    <Card className="pizgrande pdegrande claseCard">
                        <Row>
                            <Col className="pmediano">
                                <>
                                    {loading ? <div className="parenorme pizenorme"><Spinner className="azul" /></div> : 
                                    <img onClick={onButtonClick} src={imagen} className="tImagenEditar" alt="error imagen" />}
                                    <FormGroup>
                                        <input 
                                            ref={inputFile}
                                            type="file" 
                                            nombre="img" 
                                            accept="image/*" 
                                            onChange={(e) => postImagen(e.target.files[0])} 
                                            invalid={!imagen} 
                                            style={{display: "none"}}
                                            />
                                        <FormFeedback>Ingrese una imagen</FormFeedback>
                                    </FormGroup>
                                </>
                            </Col>
                        {/* PANTALLA MEDIANA */}
                            <Col md={4} className="parenorme izquierda t26 d-none d-md-block">
                                {cardPrecio}
                            </Col>
                        </Row>
                        <div className="parmediano pabmediano">       

                        {/* Nombre */}
                            <>
                                <div className="wbold">*Nombre:</div>
                                    <Input 
                                        value={nombre} 
                                        placeholder="Nombre corto" 
                                        type="text" 
                                        maxLength={60} 
                                        onChange={(e) => setNombre(e.target.value)}
                                        invalid={!nombre} />
                                    <div className="derecha pdemediano">{nombre?.length}/60</div>
                            </>
                    
                        {/* TITULO */}
                            <>
                                <div className="wbold">*Título Mercadolibre:</div>
                                    <Input 
                                        value={titulo} 
                                        placeholder="Título de la publicación" 
                                        type="text" 
                                        maxLength={60} 
                                        onChange={(e) => setTitulo(e.target.value)} 
                                        invalid={!titulo} />
                                    <div className="derecha pdemediano">{titulo?.length}/60</div>
                            </>                    
                        </div>
                        {/* PANTALLA CHICA */}
                            <div className="d-block d-md-none pabmediano">
                                <hr />
                                
                                {cardPrecio}
                            </div>
                    </Card>
                </div>

    {/* AREA 2 - Categoria - Sub-categoria - Tematica */}
                <div className="pabmuygrande">
                    <Card className="pabgrande pizgrande pdegrande claseCard">
                        <Row className="parmediano">
                            {/* Categoria */}
                            <Col>
                                    <div className="wbold">*Categoria:</div>
                                    <FormGroup>
                                        <Input 
                                        value={categoria}
                                        type="select" 
                                        onChange={(e) => {setCategoria(e.target.value); setLoading(true)}} 
                                        invalid={!categoria} >
                                            <option value="" disabled={categoria !== ""}>Seleccione:</option>
                                            {categorias?.map((c, i) => <option key={i} id={c.id} value={c.categoria}>{c.categoria}</option>)}
                                        </Input>
                                    </FormGroup>
                                </Col>
                    
                            {/* SubCategoria */}
                            <Col>
                                {loading ? <div className="centro"><Spinner className="azul" size="sm" /></div> :  
                                subCategorias.length >= 1 && <>
                                        <div className="wbold">*Sub<span className="d-none d-md-inline">-categoria</span><span className="d-inline d-md-none"></span>:</div>
                                        <FormGroup>
                                            <Input 
                                            value={subCategoria}
                                            type="select" 
                                            onChange={(e) => setSubCategoria(e.target.value)} 
                                            invalid={!subCategoria} >
                                                <option value="" disabled={subCategoria !== ""}>Seleccione:</option>
                                                {subCategorias?.map((c, i) => <option key={i} id={c.id} value={c.sub_categoria}>{c.sub_categoria}</option>)}
                                            </Input>
                                        </FormGroup>
                                    </>}
                            </Col>
                    
                            {/* Temática */}
                                <Col>
                                    <div className="wbold">Temática<span className="d-none d-md-inline"> / película</span>:</div>
                                    <FormGroup>
                                        <Input  
                                            value={tematica}
                                            placeholder="Ej: Harry Potter" 
                                            type="text" 
                                            onChange={(e) => setTematica(e.target.value)} />
                                    </FormGroup>
                                </Col>
                        </Row>                    
                    </Card>
                </div>

    {/* AREA 3 - Medidas, Material, Codigo Universal */}
                <div className="pabmuygrande">
                    <Card className="pabgrande pizgrande pdegrande claseCard">
                        <Row className="parmediano">
                        {/* Medidas */}
                            <Col>
                                <div className="wbold">Medidas:</div>
                                <FormGroup>
                                    <Input 
                                        value={medidas}
                                        placeholder="Ej: 14cm x 20cm" 
                                        type="text" 
                                        onChange={(e) => setMedidas(e.target.value)} 
                                        invalid={!medidas} />
                                </FormGroup>
                            </Col>

                        {/* Material */}
                            <Col>
                                <div className="wbold">Material:</div>
                                <FormGroup>
                                    <Input 
                                        value={material}
                                        placeholder="Ej: PVC" 
                                        type="text" 
                                        onChange={(e) => setMaterial(e.target.value)} 
                                        invalid={!material} />
                                </FormGroup>
                            </Col>

                        {/* Codigo universal */}
                            <Col>
                                <div className="wbold"><span className="d-none d-md-inline">Código universal</span><span className="d-inline d-md-none">UPC</span>:</div>
                                <FormGroup>
                                    <Input 
                                        value={codigo_universal}
                                        placeholder="Ej: 20394902" 
                                        type="number" 
                                        onChange={(e) => setCodigoUniversal(e.target.value)} 
                                        invalid={!codigo_universal} />
                                </FormGroup>
                            </Col>
                        </Row>
                    </Card>
                </div>
                
    {/* AREA 4 - Descripcion */}
                <div className="pabmuygrande">
                    <Card className="pabgrande pizgrande pdegrande claseCard">
                        <>
                            <div className="wbold parchico">*Descripción:</div>
                            <FormGroup>
                                <Input 
                                    value={descripcion}
                                    placeholder="Descripción" 
                                    type="textarea" 
                                    rows="13"
                                    onChange={(e) => setDescripcion(e.target.value)} />
                            </FormGroup>
                        </>
                    </Card>
                </div>

    {/* AREA 5 - Compuesto */}
                <div className="pabmuygrande">
                    <Card className="parmediano pizgrande pdegrande claseCard">
                        
                    {/* IsCompuesto */}
                        <>
                            <div className="wbold">*¿Es producto compuesto?</div>
                            <FormGroup>
                                <span className="pdemuychico wbold pizmediano">Sí </span> <Input type="checkbox" checked={isCompuesto} onChange={() => {setIsCompuesto(!isCompuesto)}} />
                            </FormGroup>
                            
                            {isCompuesto && <div className="parchico pabchico">
                                <span className="wbold">Costo total:</span> <NumberFormat displayType={'text'} thousandSeparator={true} prefix={'$'} value={total} />
                            {compuesto.length >= 1 && 
                                <div className="pabchico">
                                    <Card className="pmediano fondoVerdeClaro">
                                                    {compuesto.sort((a, b) => (a.producto > b.producto) ? 1 : -1).map((p, i) =>
                                                        <div key={i}>
                                                            <ProductoCompuesto p={productos?.filter(prod => prod?.id === p.producto)[0]} agregado compuesto={compuesto} setCompuesto={setCompuesto} cambio={query.length} />
                                                        </div>
                                                    )}
                                    </Card>
                                </div>
                            }
                                <div className="pabmediano">
                                    <InputGroup>
                                        <Button className="botonAzul"><FaSearch className="tIconos" /></Button>
                                        <Input type="search" placeholder="Buscar producto" input={query} onChange={e => {setQuery(e.target.value)}} />
                                    </InputGroup>
                                </div>
                                <span className="wbold">Costo total:</span> <NumberFormat displayType={'text'} thousandSeparator={true} prefix={'$'} value={total} />
                                <Card className="pmediano">
                                    <div className="overflowModal">
                                        {productosFuse.sort((a, b) => (a.nombre > b.nombre) ? 1 : -1).filter(producto => !producto.compuesto?.length).map((p, i) =>
                                            <div key={i}>
                                                <ProductoCompuesto p={p} compuesto={compuesto} setCompuesto={setCompuesto} cambio={query.length} />
                                            </div>
                                        )}
                                        {productosFuse.sort((a, b) => (a.nombre > b.nombre) ? 1 : -1).length <= 0 && 
                                            (<div className="pizchico pabmediano  parchico"><FaExclamationTriangle className="amarillo tIconos" /> No encontramos resultados para tu busqueda.</div> 
                                        )}
                                    </div>
                                </Card>
                            </div>}
                        </>
                    </Card>
                </div>

    {/* AREA 6 -  Precio Compra - Ganancia - Propietario*/}
                <div className="pabmuygrande">
                    <Card className="pargrande pabgrande pizgrande pdegrande claseCard">
                            {!isCompuesto && <div><span className="wbold azul">Precio compra:</span> ${props.p.precio_venta - props.p.precio_compra - (props.p.precio_venta >= 299 ? (props.p.envio === true ? 72 : 0) : (props.p.envio === true ? 100 : 0))} tomar en cuenta precio de compra compuesto</div>}
                            <div><span className="wbold azul">Ganancia:</span> ${props.p.precio_venta - props.p.precio_compra - (props.p.precio_venta >= 299 ? (props.p.envio === true ? 72 : 0) : (props.p.envio === true ? 100 : 0))} tomar en cuenta precio de compra compuesto</div>
                            <div><span className="wbold azul">Propietario:</span> {props.p.envio}</div>
                    </Card>
                </div>

    {/* AREA 7 -  Proveedor - Codigo producto*/}
                {!isCompuesto && <div className="pabmuygrande">
                    <Card className="pargrande pabgrande pizgrande pdegrande claseCard">
                            <div><span className="wbold azul">Proveedor:</span> {props.p.proveedor}</div>
                            <div><span className="wbold azul">Codigo Producto:</span> {props.p.codigo_producto}</div>
                    </Card>
                </div>}


    {/* AREA 7 -  Comentario*/}
                <div className="pabmuygrande">
                    <Card className="pargrande pabgrande pizgrande pdegrande claseCard">
                            <div><span className="wbold azul">Comentario:</span> {props.p.comentario}</div>
                    </Card>
                </div>

    {/* AREA 7 -  Activo - Borrar - Guardar*/}
                <div className="pabmuygrande">
                    <Card className="pabgrande pizgrande pdegrande claseCard">
                        <div><span className="wbold azul">Activo:</span> {props.p.activo ? "Activo" : "Inactivo"}</div>
                        <div className="pabchico">
                            <Button onClick={() => setActivo(!activo)} className="botonRojo w100"><FaTrash className="tIconos" /> Borrar producto</Button>
                        </div>
                        <Button onClick={() => {}} className="botonAmarillo w100">Guardar</Button>
                    </Card>
                </div>
            </Container>
       </React.Fragment>
    );
}

export default ProductoEditarID;
