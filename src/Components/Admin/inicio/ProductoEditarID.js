import React, { useContext, useEffect, useRef, useState } from "react";
import { Container, Card, Row, Col, Button, Input, FormGroup, FormFeedback, Spinner, InputGroup } from 'reactstrap'
import { FaChevronLeft } from 'react-icons/fa'
import { useNavigate } from "react-router-dom";
import UsuarioContext from "../context/UsuarioContext";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase-config";
import MenuAdmin from "../MenuAdmin";
import swal from "sweetalert";
import Fuse from 'fuse.js'
import ProductoCompuesto from "./ProductoCompuesto";
import NumberFormat from "react-number-format";
import {FaSearch, FaExclamationTriangle, FaTrash, FaCamera} from 'react-icons/fa'
import Resizer from "react-image-file-resizer";


function ProductoEditarID(props) {
    
    const {loading, setLoading, productos, setProductos, productosCache , setLoadMore} = useContext(UsuarioContext)

        
    const [imagenGrande, setImagenGrande] = useState(props.p.imagen)
    const [imagenMediana, setImagenMediana] = useState(props.p.imagen_mediana)
    const [imagenThumbnail, setImagenThumbnail] = useState(props.p.imagen_thumbnail)
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
    const [costo_envio, setCostoEnvio] = useState(props.p.costo_envio ? props.p.costo_envio : "")
    const [medidas, setMedidas] = useState(props.p.medidas ? props.p.medidas : "")
    const [material, setMaterial] = useState(props.p.material ? props.p.material : "")
    const [descripcion, setDescripcion] = useState(props.p.descripcion ? props.p.descripcion : "")
    const [cantidad, setCantidad] = useState(props.p.cantidad ? props.p.cantidad : "")
    const [proveedor, setProveedor] = useState(props.p.proveedor ? props.p.proveedor : "")
    const [propietario, setPropietario] = useState(props.p.propietario ? props.p.propietario : "")
    const [codigo_producto, setCodigoProducto] = useState(props.p.codigo_producto ? props.p.codigo_producto : "")
    const [codigo_universal, setCodigoUniversal] = useState(props.p.codigo_universal ? props.p.codigo_universal : "")
    const [subido, setSubido] = useState(props.p.subido ? props.p.subido : false)
    const [subidoAmazon, setSubidoAmazon] = useState(props.p.subido_amazon ? props.p.subido_amazon : false)
    const [subidoFacebook, setSubidoFacebook] = useState(props.p.subido_facebook ? props.p.subido_facebook : false)
    const [cambio, setCambio] = useState(true)
    const [comentario, setComentario] = useState(props.p.comentario ? props.p.comentario : "")
    const [linkCompra, setLinkCompra] = useState(props.p.link_compra ? props.p.link_compra : "")
    
    
    const [compuesto, setCompuesto] = useState(props.p.compuesto ? props.p.compuesto : [])
    const [isCompuesto, setIsCompuesto] = useState((props.p.compuesto?.length >= 1) ? true : false)
    const [cambioCompuesto, setCambioCompuesto] = useState(false)
    const [query, setQuery] = useState("")



// Setear compuesto
    if(isCompuesto && !cambioCompuesto){
        setCambioCompuesto(true)
        setPrecioCompra("")
        setProveedor("")
        setCodigoProducto("")
        setCompuesto(props.p.compuesto ? props.p.compuesto : [])
    } else if (!isCompuesto && cambioCompuesto){
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
    const total = (compuesto.length >= 1) && compuesto?.map(c => +c.cantidad * +productosCache.filter(p=> p.id === c.producto)[0]?.precio_compra)?.reduce((total, entrada) => (total += entrada))

    
    const precioInvalido = !isCompuesto ? ((precio_venta - precio_compra) <= 0) : false
    const precio_ventaInvalido = !isCompuesto ? (!precio_venta || (precioInvalido)) : !precio_venta
    const precio_venta_mlInvalido = !isCompuesto ? (!precio_venta_ml || ((precio_venta_ml - precio_compra) <= 0)) : false
    const precio_venta_mayoreoInvalido = !isCompuesto ? (!precio_venta_mayoreo || ((precio_venta_mayoreo - precio_compra) <= 0)) : false
    const productoCompuestoInvalido = isCompuesto ? compuesto?.length === 0 : false
    const precioEnvio = !isCompuesto ? ((precio_venta - precio_compra) < 20) : false
    const envioInvalido = envio === "" || precioEnvio
    const imagenInvalida = !imagenGrande || !imagenMediana || !imagenThumbnail

    const dataCompleta =  !precio_ventaInvalido && !envioInvalido && !precioInvalido && !precio_venta_mlInvalido && !productoCompuestoInvalido && nombre !== "" && titulo !== "" && !imagenInvalida



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
                    type="number" 
                    min={0}
                    onChange={(e) => setPrecioVentaML(e.target.value)} 
                    invalid={precio_venta_mlInvalido} />
                {precioInvalido && <FormFeedback className="t14">El precio de venta debe ser mayor al precio de compra.</FormFeedback>}
            </FormGroup>
        </>

    {/* Precio de venta */}
        <>
            <div className="gris t14">*Precio de retial:</div>
            <FormGroup>
                <Input
                    value={precio_venta} 
                    placeholder="Precio de venta" 
                    type="number" 
                    min={0}
                    onChange={(e) => setPrecioVenta(e.target.value)} 
                    invalid={precio_ventaInvalido} />
                {precioInvalido && <FormFeedback className="t14">El precio de venta debe ser mayor al precio de compra.</FormFeedback>}
            </FormGroup>
        </>

    {/* Precio de venta */}
        <>
            <div className="gris t14">*Precio de mayoreo:</div>
            <FormGroup>
                <Input
                    value={precio_venta_mayoreo} 
                    placeholder="Precio de venta" 
                    type="number" 
                    min={0}
                    onChange={(e) => setPrecioVentaMayoreo(e.target.value)} 
                    invalid={precio_venta_mayoreoInvalido} />
                {precioInvalido && <FormFeedback className="t14">El precio de venta debe ser mayor al precio de compra.</FormFeedback>}
            </FormGroup>
        </>
        <hr />
        
    {/* Envio */}
            <Row>
                <Col>
                    <div className="wbold t15 verdeObscuro">*Envío incluido:</div>
                    <FormGroup>
                        <Input value={envio} type="select" onChange={(e) => setEnvio(e.target.value)} invalid={envioInvalido} >
                            <option value="" disabled={envio !== ""}>Seleccione:</option>
                            {precio_venta_ml < 299 && <option value={false} >No</option>}
                            {precio_venta_ml >= 250 && <option value={true}>Sí</option>}
                        </Input>
                        <FormFeedback className="t14">{`${precioEnvio ? "Muy poca ganancia valide nuevamente." : "¿Envío incluido en precio de venta?"}`}</FormFeedback>
                    </FormGroup>
                </Col>
                <Col>
                    <div className="wbold t15 verdeObscuro">*Costo envío:</div>
                    <FormGroup>
                        <Input 
                            value={costo_envio} 
                            type="number" 
                            min={0}
                            placeholder="Mercadolibre" 
                            onChange={(e) => setCostoEnvio(e.target.value)} />
                    </FormGroup>
                </Col>
            </Row>
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


    // PROMESA IMAGEN RESIZE Thumbnail
    const resizeFileThumbnail = (file) =>
        new Promise((resolve) => {
        Resizer.imageFileResizer(
            file,
            150,
            150,
            "PNG",
            80,
            0,
            (uri) => {
            resolve(uri);
            },
            "file"
        );
    });
    // PROMESA IMAGEN RESIZE MEDIANA
    const resizeFileMediana = (file) =>
        new Promise((resolve) => {
        Resizer.imageFileResizer(
            file,
            350,
            350,
            "PNG",
            80,
            0,
            (uri) => {
            resolve(uri);
            },
            "file"
        );
    });
    // PROMESA IMAGEN RESIZE GRANDE
    const resizeFileGrande = (file) =>
        new Promise((resolve) => {
        Resizer.imageFileResizer(
            file,
            700,
            700,
            "PNG",
            80,
            0,
            (uri) => {
            resolve(uri);
            },
            "file"
        );
    });

    

// POST IMAGEN ---------------------------------------------------------------
    const postImagen = async(img) => {
        setLoading(true)

        if(img === undefined){
            swal({
                title: "Te falto la imagen",
                text: "Checa de nuevo",
                icon: "warning",
                button: "Cerrar"
            })
        }

        const imageThumbnail = await resizeFileThumbnail(img)
        const imageMediana = await resizeFileMediana(img)
        const imageGrande = await resizeFileGrande(img)

        if (imageThumbnail.type === "image/png" || imageThumbnail.type === "image/jpeg" || imageThumbnail.type === "image/jpg" || imageThumbnail.type === "image/webp"){
            const data = new FormData();
            data.append("file", imageThumbnail);
            console.log("subida")
            data.append("upload_preset", "mercadoalamano");
            data.append("cloud_name",  "mercadoalamano");
            fetch("https://api.cloudinary.com/v1_1/mercadoalamano/image/upload", 
            {method: 'post', body: data}).then((res) => res.json())
            .then(data => {
                setImagenThumbnail(data.url.toString());
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
        
        if (imageMediana.type === "image/png" || imageMediana.type === "image/jpeg" || imageMediana.type === "image/jpg" || imageMediana.type === "image/webp"){
            const data = new FormData();
            data.append("file", imageMediana);
            console.log("subida")
            data.append("upload_preset", "mercadoalamano");
            data.append("cloud_name",  "mercadoalamano");
            fetch("https://api.cloudinary.com/v1_1/mercadoalamano/image/upload", 
            {method: 'post', body: data}).then((res) => res.json())
            .then(data => {
                setImagenMediana(data.url.toString());
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
            setLoading(false)
        }
        
        if (imageGrande.type === "image/png" || imageGrande.type === "image/jpeg" || imageGrande.type === "image/jpg" || imageGrande.type === "image/webp"){
            const data = new FormData();
            data.append("file", imageGrande);
            console.log("subida")
            data.append("upload_preset", "mercadoalamano");
            data.append("cloud_name",  "mercadoalamano");
            fetch("https://api.cloudinary.com/v1_1/mercadoalamano/image/upload", 
            {method: 'post', body: data}).then((res) => res.json())
            .then(data => {
                setImagenGrande(data.url.toString());
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
            setLoading(false)
        }
    }


    const fuse = new Fuse(productosCache, {
        keys: [
            {name:"nombre", weight: 0.3}, 
            {name:"titulo", weight: 0.1}, 
            {name:"tematica", weight: 0.10}, 
            {name:"categoria", weight: 0.25}, 
            {name:"sub_categoria", weight: 0.05}, 
            {name:"propietario", weight: 0.1}
        ],
        threshold: 0.4,
        includeScore: true,
        shouldSort: true,
      })
    
    
        const busqueda = fuse.search(query) 
        const productosFuse = query ? busqueda.sort((a, b) => (a.score > b.score) ? 1 : -1).map(resultado => resultado.item) : productosCache.sort((a, b) => (a.nombre > b.nombre) ? 1 : -1)


    const dataFinal = {
        id: props.p?.id,
        imagen_thumbnail: imagenThumbnail,
        imagen_mediana: imagenMediana,
        imagen: imagenGrande,
        nombre: nombre,
        tematica: tematica,
        titulo: titulo,
        codigo_universal: categorias?.filter(c => categoria === c.categoria)[0]?.codigo_universal,
        categoria: categoria,
        sub_categoria: subCategoria,
        precio_compra: !isCompuesto ? precio_compra : "",
        precio_venta_ml: precio_venta_ml,
        precio_venta: precio_venta,
        precio_venta_mayoreo: precio_venta_mayoreo,
        envio: envio === "false" ? false : envio === "true" ? true  : props.p?.envio,
        costo_envio: costo_envio,
        medidas: medidas,
        material: material,
        descripcion: descripcion,
        cantidad: cantidad,
        proveedor: !isCompuesto ? proveedor : "",
        link_compra: linkCompra,
        propietario: propietario,
        subido: subido === "false" ? false : subido === "true" ? true : subido,
        subido_amazon: subidoAmazon === "false" ? false : subidoAmazon === "true" ? true : subidoAmazon,
        subido_facebook: subidoFacebook === "false" ? false : subidoFacebook === "true" ? true : subidoFacebook,
        codigo_producto: !isCompuesto ? codigo_producto : "",
        compuesto: isCompuesto ? compuesto : [],
        comentario: comentario,
        activo: props.p?.activo,
    }
    
// ACTUALIZAR PRODUCTO ------------------------------------------------------------
    const actualizarProducto = async() => {
        setLoading(true);
        if(!dataCompleta){
            swal({
                title: "Error",
                text: "Intente nuevamente",
                icon: "error",
                button: "cerrar"
            });
            setLoading(false);
            return
        }
        try {

            await updateDoc(doc(db, "productos", props.p.id), dataFinal)
            
            swal({
                title: "Producto actualizado",
                text: "",
                icon: "success",
                button: "cerrar"
            })
            const dataSplice = productos.splice(props.i, 1)

            const setCache = [ dataFinal, ...productosCache ]
            const unico = setCache.filter((value, index, self) =>
                index === self.findIndex((t) => (
                    t.id === value.id
                ))
            )
            console.log(dataSplice)
            console.log(unico)
            
            localStorage.setItem('productoInfo', JSON.stringify([...productos, dataFinal]))
            setProductos([...productos, dataFinal])
            localStorage.setItem('productosCache', JSON.stringify([...unico])) 
            window.close()
            setLoading(false);
        } catch (error){
            swal({
                    title: "Error",
                    text: `No se ha podido actualizar el producto, ${error.message}`,
                    icon: "error",
                    button: "cerrar"
                });
                setLoading(false);
            }
        }
    
// ELIMINAR PRODUCTO (INACTIVAR) ------------------------------------------------------------
    const eliminarProducto = async() => {
        setLoading(true);
        if(!dataCompleta){
            swal({
                title: "Error",
                text: "Intente nuevamente",
                icon: "error",
                button: "cerrar"
            });
            setLoading(false);
            return
        }
        try {
            await updateDoc(doc(db, "productos", props.p.id), {...props.p, activo: false})

            swal({
                title: "Producto eliminado",
                text: "Has eliminado el producto",
                icon: "success",
                button: "cerrar"
            })
            // const dataSplice = productos.splice(props.i, 1)
            // console.log(dataSplice)
            // localStorage.setItem('productoInfo', JSON.stringify(productos))
            // setProductos([...productos])
            navigate(`/admin/inicio`)
            window.location.reload()
            setLoading(false);
            } catch (error){
                swal({
                    title: "Error",
                    text: `No se ha podido borrar el producto, ${error.message}`,
                    icon: "error",
                    button: "cerrar"
                });
                setLoading(false);
        }
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

    const ganancia = precio_venta_ml - costo_envio - (isCompuesto ? total : precio_compra)


    return (
        <React.Fragment>
            <MenuAdmin />
            <Container className="parmediano pabenorme noselect">
            <div className="parmediano pabmediano"><Button onClick={() => regresar()} className="botonTransparente azul"><FaChevronLeft className="tIconos" /> Volver</Button></div>
            <div className="wbold t25 pabgrande">{props.p.nombre}</div>

    {/* AREA 0 - Imagen - Nombre - Titulo - Precio Venta - Precio Venta ML - Precio Mayoreo - Envio */}
                <div className="pabmuygrande">
                    <Card className="pizgrande pdegrande claseCard">
                        <Row>
                            <Col md={7} lg={5} className="pmediano alineacionImagenEditar">
                                <>
                                    <div className="contenedor">
                                        {loading ? <div className="parenorme pizenorme"><Spinner className="azul" /></div> : 
                                        <>
                                            <div onClick={onButtonClick} className="overlayImagenEditar"></div>
                                            <FaCamera onClick={onButtonClick} className="posicionCamara" />
                                            <img onClick={onButtonClick} src={imagenGrande} className="tImagenEditar" alt="error imagen" />
                                        </>}
                                    </div>
                                    <FormGroup>
                                        <input 
                                            ref={inputFile}
                                            type="file" 
                                            nombre="img" 
                                            accept="image/*" 
                                            onChange={(e) => postImagen(e.target.files[0])} 
                                            invalid={imagenInvalida} 
                                            style={{display: "none"}}
                                            />
                                        <FormFeedback>Ingrese una imagen</FormFeedback>
                                    </FormGroup>
                                </>
                            </Col>
                        {/* PANTALLA MEDIANA */}
                            <Col md={5} lg={7} className="parenorme izquierda t26 d-none d-md-block">
                                {cardPrecio}
                            </Col>
                        </Row>
                        <div className="pabmediano">       

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

    {/* AREA 1 - Cantidad */}
                {!isCompuesto && <div className="pabmuygrande">
                    <Card className="parmediano pdegrande pizgrande pabgrande claseCard">
                        {/* Cantidad */}
                        <>
                            <div className="wbold">Cantidad en inventario:</div>
                            <Input 
                                value={cantidad} 
                                placeholder="0" 
                                type="number" 
                                min={0}
                                onChange={(e) => setCantidad(e.target.value)} />
                        </>      
                    </Card>
                </div>}

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
                                        min={0}

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
                                                <ProductoCompuesto p={productosCache?.filter(prod => prod?.id === p.producto)[0]} agregado compuesto={compuesto} setCompuesto={setCompuesto} cambio={query.length} />
                                            </div>
                                        )}
                                    </Card>
                                </div>
                            }
                                <div className="pabmediano">
                                    <InputGroup>
                                        <Button className="botonAzul"><FaSearch className="tIconos" /></Button>
                                        <Input type="search" placeholder="Buscar producto" input={query} onChange={e => {setQuery(e.target.value); setLoadMore(5000)}} />
                                    </InputGroup>
                                </div>
                                <span className="wbold">Costo total:</span> <NumberFormat displayType={'text'} thousandSeparator={true} prefix={'$'} value={total} />
                                <Card className="pmediano">
                                    <div className="overflowModal">
                                        {productosFuse.sort((a, b) => (a.nombre > b.nombre) ? 1 : -1).filter(a => a.activo).filter(producto => producto.id !== props.p.id).filter(producto => !producto.compuesto?.length).map((p, i) =>
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

    {/* AREA 6 -  Precio Compra - Ganancia*/}
                <div className="pabmuygrande">
                    <Card className="pargrande pabgrande pizgrande pdegrande claseCard">
                        {!isCompuesto && <>

                    {/* Precio de compra */}
                            <div className="wbold">*Precio de compra:</div>
                            <FormGroup>
                                <Input 
                                    value={precio_compra} 
                                    placeholder="Precio de compra" 
                                    type="number" 
                                    min={0}
                                    onChange={(e) => setPrecioCompra(e.target.value)} 
                                    invalid={!precio_compra} />
                            </FormGroup>
                        </>}
                        {isCompuesto && <div><span className="wbold azul">Precio compra:</span> <NumberFormat className="wbold amarilloObscuro" displayType={'text'} thousandSeparator={true} prefix={'$'} value={total} /></div>}
                        <div><span className="wbold azul">Ganancia esperada:</span> <NumberFormat className={`wbold ${ganancia <= 0 ? "rojo" : "verdeObscuro"}`} displayType={'text'} thousandSeparator={true} prefix={'$'} value={ganancia} /></div>
             
                    </Card>
                </div>

    {/* AREA 7 -  Proveedor - Codigo producto*/}
                {!isCompuesto && <div className="pabmuygrande">
                    <Card className="pargrande pabgrande pizgrande pdegrande claseCard">

                    {/* Proveedor */}
                        {!isCompuesto && <>
                            <div className="wbold">Proveedor:</div>
                            <FormGroup>
                                <Input value={proveedor} placeholder="Nombre del proveedor" type="text" onChange={(e) => setProveedor(e.target.value)} />
                            </FormGroup>
                        </>} 

                    {/* Código */}
                        {!isCompuesto && <div>
                            <div className="wbold">Código del producto:</div>
                            <FormGroup>
                                <Input value={codigo_producto} placeholder="(del proveedor)" type="text" onChange={(e) => setCodigoProducto(e.target.value)} />
                            </FormGroup>
                        </div>}

                    {/* Link de Compra */}
                        {!isCompuesto && <div>
                            <div className="wbold">Link de compra:</div>
                            <FormGroup>
                                <Input value={linkCompra} placeholder="URL" type="text" onChange={(e) => setLinkCompra(e.target.value)} />
                            </FormGroup>
                        </div>}

                    </Card>
                </div>}


    {/* AREA 8 -  Comentario - Subido - Propietario*/}
                <div className="pabmuygrande">
                    <Card className="pargrande pabgrande pizgrande pdegrande claseCard">
                        
                        {/* Subido */}
                        <>
                            <div className="wbold">¿Subido en Mercadolibre?</div>
                            <FormGroup>
                                <Input value={subido} type="select" onChange={(e) => setSubido(e.target.value)} >
                                    <option value="" disabled={subido !== ""}>Seleccione:</option>
                                    <option value={true}>Sí</option>
                                    <option value={false}>No</option>
                                </Input>
                            </FormGroup>
                        </>
                        {/* Subido */}
                        <>
                            <div className="wbold">¿Subido en Amazon?</div>
                            <FormGroup>
                                <Input value={subidoAmazon} type="select" onChange={(e) => setSubidoAmazon(e.target.value)} >
                                    <option value="" disabled={subidoAmazon !== ""}>Seleccione:</option>
                                    <option value={true}>Sí</option>
                                    <option value={false}>No</option>
                                </Input>
                            </FormGroup>
                        </>
                        {/* Subido */}
                        <>
                            <div className="wbold">¿Subido en Facebook?</div>
                            <FormGroup>
                                <Input value={subidoFacebook} type="select" onChange={(e) => setSubidoFacebook(e.target.value)} >
                                    <option value="" disabled={subidoFacebook !== ""}>Seleccione:</option>
                                    <option value={true}>Sí</option>
                                    <option value={false}>No</option>
                                </Input>
                            </FormGroup>
                        </>
                            
                        {/* COMENTARIO */}
                            <>
                                <div className="wbold parchico">Comentario:</div>
                                <FormGroup>
                                    <Input 
                                        value={comentario}
                                        placeholder="Comentario" 
                                        type="textarea" 
                                        rows="3"
                                        onChange={(e) => setComentario(e.target.value)} />
                                </FormGroup>
                            </>
                    {/* Propietario */}
                    <>
                            <div className="wbold">*Propietario:</div>
                            <FormGroup>
                                <Input value={propietario} type="select" onChange={(e) => setPropietario(e.target.value)} invalid={!propietario} >
                                    <option value="" disabled={propietario !== ""}>Seleccione:</option>
                                    <option value="Jorge">Jorge</option>
                                    <option value="Ana">Ana</option>
                                    <option value="Ana y Jorge">Ana y Jorge</option>
                                </Input>
                                <FormFeedback>Dueño del producto (Jorge o Ana)</FormFeedback>
                            </FormGroup>
                        </>
                    </Card>
                </div>
                

    {/* AREA 9 -  Activo - Borrar - Guardar*/}
                <div className="pabmuygrande">
                    <Card className="pmuygrande claseCard">
                        {loading ? <div className="azul penorme centro"><Spinner /></div> : <>
                            <div className="pabchico">
                                <Button disabled={!dataCompleta} onClick={() => {actualizarProducto()}} className="botonAmarillo w100">Guardar cambios</Button>
                            </div>
                            <div className="pabchico">
                                <Button onClick={() => {window.scrollTo(0, 0); navigate(`/admin/publicar-similar/${props.p.id}`)}} className="botonAzul w100">Publicar similar</Button>
                            </div>
                            {/* funcion de inactivar directamente sin state */}
                            <Button onClick={() => swal({ 
                                        title: "¿Estás segur@?" , 
                                        text: "No podrás revertirlo!", 
                                        icon: "warning", 
                                        buttons: ["Cancelar", "Borrar"]
                                    }).then((res) => {if(res){eliminarProducto()}})} className="botonRojo w100"><FaTrash className="tIconos" /> Borrar producto</Button>
                        </>}
                    </Card>
                </div>
            </Container>
       </React.Fragment>
    );
}

export default ProductoEditarID;
