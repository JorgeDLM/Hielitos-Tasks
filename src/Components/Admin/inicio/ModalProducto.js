import React, { useContext, useEffect, useState } from "react";
import { Button, Modal, Input, FormGroup, FormFeedback, Spinner, Card, InputGroup } from "reactstrap";
import swal from 'sweetalert';
import logo from '../../../imgs/logoNegro.png'
import { collection, addDoc, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../../../firebase-config';
import UsuarioContext from "../context/UsuarioContext";
import Fuse from 'fuse.js'
import ProductoCompuesto from "./ProductoCompuesto";
import NumberFormat from "react-number-format";
import {FaSearch, FaExclamationTriangle, FaPlus} from 'react-icons/fa'
import Resizer from "react-image-file-resizer";

function ModalProducto() {

    const {productos, setProductos, setLoadMore, categorias} = useContext(UsuarioContext)

    const [modal, setModal] = useState(false)
    const [imagenGrande, setImagenGrande] = useState("")
    const [imagenMediana, setImagenMediana] = useState("")
    const [imagenThumbnail, setImagenThumbnail] = useState("")
    const [nombre, setNombre] = useState("")
    const [titulo, setTitulo] = useState("")
    const [tituloDefault, setTituloDefault] = useState("")
    const [categoria, setCategoria] = useState("")
    const [subCategoria, setSubCategoria] = useState("")
    const [subCategorias, setSubCategorias] = useState([])
    const [tematica, setTematica] = useState("")
    const [precio_compra, setPrecioCompra] = useState("")
    const [precio_venta, setPrecioVenta] = useState("")
    const [precio_venta_ml, setPrecioVentaML] = useState("")
    const [precio_venta_mayoreo, setPrecioVentaMayoreo] = useState("")
    const [envio, setEnvio] = useState("")
    const [medidas, setMedidas] = useState("")
    const [material, setMaterial] = useState("")
    const [descripcion, setDescripcion] = useState("")
    const [descripcionDefault, setDescripcionDefault] = useState("")
    const [cantidad, setCantidad] = useState("")
    const [proveedor, setProveedor] = useState("")
    const [propietario, setPropietario] = useState("")
    const [codigo_producto, setCodigoProducto] = useState("")
    const [subido, setSubido] = useState("")
    const [loading, setLoading] = useState("")
    const [cambio, setCambio] = useState(true)
    const [linkCompra, setLinkCompra] = useState("")
    
    const [clickeado, setClickeado] = useState(false)
    
    const [queryFuse, setQuery] = useState("")
    const [isCompuesto, setIsCompuesto] = useState(false)
    const [compuesto, setCompuesto] = useState([])
    const [cambioCompuesto, setCambioCompuesto] = useState(false)

    const total = (compuesto.length >= 1) && compuesto?.map(c => +c.cantidad * +productos.filter(p=> p.id === c.producto)[0].precio_compra)?.reduce((total, entrada) => (total += entrada))


    if(isCompuesto && !cambioCompuesto){
        setCambioCompuesto(true)
        setPrecioCompra("")
        setProveedor("")
        setCodigoProducto("")
    } 
    if(!isCompuesto && cambioCompuesto){
        setCambioCompuesto(false)
        setCompuesto([])
    }


    const imagenInvalida = !imagenGrande || !imagenMediana || !imagenThumbnail
    const nombreInvalido = !nombre
    const tituloInvalido = !nombre
    const categoriaInvalida = categoria === ""
    const subCategoriaInvalida = subCategoria === ""
    const precio_compraInvalido = !precio_compra
    const precioInvalido = !isCompuesto ? ((precio_venta - precio_compra) <= 0) : false
    const precio_ventaInvalido = !isCompuesto ? (!precio_venta || (precioInvalido)) : !precio_venta
    const precio_venta_mlInvalido = !isCompuesto ? (!precio_venta_ml || ((precio_venta_ml - precio_compra) <= 0)) : false
    const precio_venta_mayoreoInvalido = !isCompuesto ? (!precio_venta_mayoreo || ((precio_venta_mayoreo - precio_compra) <= 0)) : false
    const precioEnvio = !isCompuesto ? ((precio_venta - precio_compra) < 20) : false
    const envioInvalido = envio === "" || precioEnvio
    const propietarioInvalida = propietario === ""
    const productoCompuestoInvalido = isCompuesto ? compuesto?.length === 0 : false

    if (precio_venta >= 299 && cambio){
        setCambio(false)
    }
    if (precio_venta < 299 && !cambio){
        setCambio(true)
    }

    const clearInputs = () => {
        setImagenGrande("")
        setImagenMediana("")
        setImagenThumbnail("")
        setNombre("")
        setTitulo("")
        setTituloDefault("")
        setTematica("")
        setCategoria("")
        setSubCategoria("")
        setPrecioCompra("")
        setPrecioVenta("")
        setPrecioVentaML("")
        setEnvio("")
        setMedidas("")
        setMaterial("")
        setDescripcion("")
        setCantidad("")
        setProveedor("")
        setPropietario("")
        setDescripcionDefault("")
        setCodigoProducto("")
        setSubido("")
        setModal(false)
    }

    const dataCompleta =  !imagenInvalida && !tituloInvalido && !nombreInvalido && !categoriaInvalida && !precio_ventaInvalido && !envioInvalido && !propietarioInvalida && !precioInvalido && !precio_venta_mlInvalido && !productoCompuestoInvalido

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


// POST IMAGEN---------------------------------------------------------------
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


// SUBIR PRODUCTO ------------------------------------------------------------
    const subirProducto = async() => {
        setLoading(true);
        setClickeado(true)
        if(!dataCompleta){
            swal({
                title: "Rellene todos los campos",
                text: "¿Te falta algo?",
                icon: "error",
                button: "cerrar"
            });
            setLoading(false);
            setClickeado(false)
            return
        }
        try {
        // SUBIR PRODUCTO firebase: ---------------------------------------------------
            const data = {
                imagen_thumbnail: imagenThumbnail,
                imagen_mediana: imagenMediana,
                imagen: imagenGrande,
                nombre: nombre,
                tematica: tematica ? tematica : "",
                titulo: titulo ? titulo : tituloDefault,
                codigo_universal: categorias?.filter(c => categoria === c.categoria)[0]?.codigo_universal,
                categoria: categoria,
                sub_categoria: subCategoria ? subCategoria : "",
                precio_compra: !isCompuesto ? precio_compra : "",
                precio_venta: precio_venta ? precio_venta : "",
                precio_venta_ml: precio_venta_ml ? precio_venta_ml : "",
                precio_venta_mayoreo: precio_venta_mayoreo ? precio_venta_mayoreo : "",
                envio: envio === "false" ? false : envio === "true" ? true : false,
                costo_envio: envio === "true" ? 100 : 0,
                medidas: medidas ? medidas : "",
                material: material ? material : "",
                descripcion: descripcion ? descripcion : descripcionDefault,
                cantidad: cantidad ? cantidad : 0,
                cantidad_minima: 0,
                proveedor: !isCompuesto ? proveedor : "",
                link_compra: linkCompra,
                propietario: propietario ? propietario : "",
                subido: subido === "false" ? false : subido === "true" ? true : false,
                subido_amazon: false,
                subido_facebook: false,
                codigo_producto: !isCompuesto ? codigo_producto : "",
                compuesto: isCompuesto ? compuesto : [],
                comentario: "",
                activo: true,
            }

            const newProduct = async () => {
                await addDoc(collection(db, "productos"), data)
            }
            newProduct()
        // -----------------------------------------------------------------------------

            swal({
                title: "¡Felicidades!",
                text: "Has añadido un nuevo producto",
                icon: "success",
                button: "cerrar"
            })

            localStorage.setItem('productoInfo', JSON.stringify(data))
            setProductos([...productos, data])
            clearInputs()
            setClickeado(false)
            setLoading(false);

            // window.location.reload()

            } catch (error){
                swal({
                    title: "Error",
                    text: `No se ha podido subir el producto, ${error.message}`,
                    icon: "error",
                    button: "cerrar"
                });
                setLoading(false);
                setClickeado(false)
            
        }
    }

// FETCH SUBCATEGORIAS
useEffect(() => {
    const categoriaID = categorias?.filter(c => categoria === c.categoria)[0]?.id
    const set = async () => {
        const dataSubCategorias = query(collection(db, "categorias", categoriaID, "sub_categorias"), orderBy("sub_categoria", "asc"))
        const querySnapshot =  await getDocs(dataSubCategorias)
        const data = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}))
        setSubCategorias(data)
    }
    if(categoria !== ""){
        set()
    }
    setLoading(false)
}, [categoria, categorias])

    const crearTitulo = () => {
        const tituloLength =  `${nombre}${tematica && " - " + tematica}`
        const tematicaTrue = (tituloLength.length <= 60)
        setTituloDefault(`${nombre}${tematicaTrue ? `${tematica && " - " + tematica}` : ""}`)
    }

    const crearDescripcion = () => {
        setDescripcionDefault(
`*********************************************************************************************************
¡PUBLICACIÓN POR ${nombre.toUpperCase()}${tematica && " DE "}${tematica.toUpperCase()}!
*********************************************************************************************************

Material: ${material}
Tipo: ${!subCategoria ? categoria : subCategoria}
Tamaño: ${medidas}


*********************************************************************************************************
Contamos con más ${categoria}${tematica && " de " + tematica}, si buscabas algo en especial contáctanos! Recuerda que en 
tu compra de $299 o más el envió es gratis! Si tienes dudas estaremos para resolverte.
*********************************************************************************************************`)}



const fuse = new Fuse(productos, {
    keys: [
        {name:"nombre", weight: 0.6}, 
        {name:"titulo", weight: 0.2}, 
        {name:"tematica", weight: 0.1},
    ],
    threshold: 0.4,
    includeScore: true,
    shouldSort: true,
  })


    const busqueda = fuse.search(queryFuse) 
    const productosFuse = queryFuse ? busqueda.sort((a, b) => (a.score > b.score) ? 1 : -1).map(resultado => resultado.item) : productos.sort((a, b) => (a.nombre > b.nombre) ? 1 : -1)


    return (
        <React.Fragment>
            <Button onClick={() => setModal(!modal)} className="botonNegro w100 tCategoria" disabled={clickeado === true}><FaPlus className="tIconoCategoria" /> Producto</Button>
            <Modal isOpen={modal} toggle={() => setModal(!modal)}> 
                <div className="pargrande azul wbolder centro tmuygrande">
                    {imagenGrande === "" ? 
                        (<img className="productoLista" src={logo} alt="Error" />)
                        :
                        (<img className="productoLista" src={imagenGrande} alt="Error" />)
                    }
                </div>
                <div className="pmediano">

                {/* Imagen */}
                    <>
                        <div className="wbold">** Imagen:</div>
                        <FormGroup>
                            {/* <Image publicId="/foksrvlbfpxaoz5kn446" cloud_name="mercadoalamano" version="1649698988" secure="true" width="350" crop="fill" alt="error">
                                <Transformation width="350" crop="fill" />
                            </Image> */}
                            <Input type="file" nombre="img" accept="image/*" onChange={(e) => postImagen(e.target.files[0])} invalid={imagenInvalida} />
                            <FormFeedback>Ingrese una imagen</FormFeedback>
                        </FormGroup>
                    </>

                {/* Nombre */}
                    <>
                        <div className="wbold">** Nombre:</div>
                            <Input onBlur={() => {crearTitulo(); crearDescripcion()}} placeholder="Nombre corto" type="text" maxLength={60} onChange={(e) => setNombre(e.target.value)} invalid={nombreInvalido} />
                        <div className="derecha pdemediano">{nombre?.length}/60</div>
                    </>

                {/* Temática */}
                    <>
                        <div className="wbold">Temática / película:</div>
                        <FormGroup>
                            <Input onBlur={() => {crearTitulo(); crearDescripcion()}} placeholder="Ej: Harry Potter" type="text" onChange={(e) => setTematica(e.target.value)} />
                        </FormGroup>
                    </>

                {/* TITULO */}
                    <>
                        <div className="wbold">** Título:</div>
                            <Input 
                                defaultValue={tituloDefault}
                                // value={titulo}
                                placeholder="Título de la publicación" 
                                type="text" 
                                maxLength={60} 
                                onChange={(e) => setTitulo(e.target.value)} 
                                invalid={tituloInvalido} />
                        <div className="derecha pdemediano">{titulo?.length !== 0 ? titulo?.length : tituloDefault.length}/60</div>
                    </>

                {/* Categoria */}
                    <>
                        <div className="wbold">** Categoria:</div>
                        <FormGroup>
                            <Input onBlur={() => {crearDescripcion()}} type="select" onChange={async(e) => {setCategoria(e.target.value); setLoading(true)}} invalid={categoriaInvalida} >
                                <option value="" disabled={categoria !== ""}>Seleccione:</option>
                                {categorias?.map((c, i) => <option key={i} id={c.id} value={c.categoria}>{c.categoria}</option>)}
                            </Input>
                        </FormGroup>
                    </>

                {/* SubCategoria */}
                   <>
                       {loading ? <div className="centro"><Spinner className="azul" size="sm" /></div> :  
                       subCategorias.length >= 1 && <>
                            <div className="wbold">** Sub-categoria:</div>
                            <FormGroup>
                                <Input onBlur={() => {crearDescripcion()}} type="select" onChange={(e) => setSubCategoria(e.target.value)} invalid={subCategoriaInvalida} >
                                    <option value="" disabled={subCategoria !== ""}>Seleccione:</option>
                                    {subCategorias?.map((c, i) => <option key={i} id={c.id} value={c.sub_categoria}>{c.sub_categoria}</option>)}
                                </Input>
                            </FormGroup>
                        </>}
                   </>


                {/* IsCompuesto */}
                    <>
                        <div className="wbold">** ¿Es producto compuesto?</div>
                        <FormGroup>
                            <span className="pdemuychico wbold pizmediano">Sí </span> <Input type="checkbox"  checked={isCompuesto} onChange={() => setIsCompuesto(!isCompuesto)} />
                        </FormGroup>
                        
                        {isCompuesto && <div className="parchico pabchico">
                            <span className="wbold">Costo total:</span> <NumberFormat displayType={'text'} thousandSeparator={true} prefix={'$'} value={total} />
                           {compuesto.length >= 1 && 
                            <div className="pabchico">
                                <Card className="pmediano fondoVerdeClaro">
                                    {compuesto.sort((a, b) => (a.producto > b.producto) ? 1 : -1).map((p, i) =>
                                        <div key={i}>
                                            <ProductoCompuesto p={productos?.filter(prod => prod?.id === p.producto)[0]} agregado compuesto={compuesto} setCompuesto={setCompuesto} cambio={queryFuse.length} />
                                        </div>
                                    )}
                                </Card>
                            </div>
                           }
                            <div className="pabmediano">
                                <InputGroup>
                                    <Button className="botonAzul"><FaSearch className="tIconos" /></Button>
                                    <Input type="search" placeholder="Buscar producto" input={queryFuse} onChange={e => {setQuery(e.target.value); setLoadMore(5000)}} />
                                </InputGroup>
                            </div>
                            <span className="wbold">Costo total:</span> <NumberFormat displayType={'text'} thousandSeparator={true} prefix={'$'} value={total} />
                            <Card className="pmediano">
                                <div className="overflowModal">
                                    {productosFuse.filter(prod => prod.activo).sort((a, b) => (a.nombre > b.nombre) ? 1 : -1).filter(producto => !producto.compuesto?.length).map((p, i) =>
                                        <div key={i}>
                                            <ProductoCompuesto p={p} compuesto={compuesto} setCompuesto={setCompuesto} cambio={queryFuse.length} />
                                        </div>
                                    )}
                                    {productosFuse.filter(a => a.activo).sort((a, b) => (a.nombre > b.nombre) ? 1 : -1).length <= 0 && 
                                        (<div className="pizchico pabmediano  parchico"><FaExclamationTriangle className="amarillo tIconos" /> No encontramos resultados para tu busqueda.</div> 
                                    )}
                                </div>
                            </Card>
                        </div>}
                    </>

                {/* Precio de venta */}
                    <>
                        <div className="wbold">** Precio de venta Mercadolibre:</div>
                        <FormGroup>
                            <Input placeholder="Precio de venta Mercadolibre" type="number" min={0} onChange={(e) => setPrecioVentaML(e.target.value)} invalid={precio_venta_mlInvalido} />
                            {precioInvalido && <FormFeedback>El precio de venta debe ser mayor al precio de compra.</FormFeedback>}
                        </FormGroup>
                    </>

                {/* Precio de venta */}
                    <>
                        <div className="wbold">** Precio de retial:</div>
                        <FormGroup>
                            <Input placeholder="Precio de venta" type="number" min={0} onChange={(e) => setPrecioVenta(e.target.value)} invalid={precio_ventaInvalido} />
                            {precioInvalido && <FormFeedback>El precio de venta debe ser mayor al precio de compra.</FormFeedback>}
                        </FormGroup>
                    </>

                {/* Precio de venta */}
                    <>
                        <div className="wbold">** Precio de mayoreo:</div>
                        <FormGroup>
                            <Input placeholder="Precio de venta" type="number" min={0} onChange={(e) => setPrecioVentaMayoreo(e.target.value)} invalid={precio_venta_mayoreoInvalido} />
                            {precioInvalido && <FormFeedback>El precio de venta debe ser mayor al precio de compra.</FormFeedback>}
                        </FormGroup>
                    </>

                {/* Precio de compra */}
                    {!isCompuesto && <>
                        <div className="wbold">** Precio de compra:</div>
                        <FormGroup>
                            <Input placeholder="Precio de compra" type="number" min={0} onChange={(e) => setPrecioCompra(e.target.value)} invalid={precio_compraInvalido} />
                        </FormGroup>
                    </>}

                {/* Envio */}
                    <>
                        <div className="wbold">** Envío:</div>
                        <FormGroup>
                            <Input type="select" onChange={(e) => setEnvio(e.target.value)} invalid={envioInvalido} >
                                <option value="" disabled={envio !== ""}>Seleccione:</option>
                                {precio_venta_ml < 299 && <option value={false} >No</option>}
                                {precio_venta_ml >= 250 && <option value={true}>Sí</option>}
                            </Input>
                            <FormFeedback>{`${precioEnvio ? "Muy poca ganancia valide nuevamente." : "¿Envío incluido en precio de venta?"}`}</FormFeedback>
                        </FormGroup>
                    </>

                {/* Medidas */}
                    <>
                        <div className="wbold">Medidas:</div>
                        <FormGroup>
                            <Input onBlur={() => {crearDescripcion()}}  placeholder="Ej: 14cm x 20cm" type="text" onChange={(e) => setMedidas(e.target.value)} invalid={!medidas} />
                        </FormGroup>
                    </>

                {/* Material */}
                    <>
                        <div className="wbold">Material:</div>
                        <FormGroup>
                            <Input onBlur={() => {crearDescripcion()}}  placeholder="Ej: PVC" type="text" onChange={(e) => setMaterial(e.target.value)} invalid={!material} />
                        </FormGroup>
                    </>

                {/* Descripción */}
                    <>
                        <div className="wbold">** Descripción:</div>
                        <FormGroup>
                            <Input placeholder="Descripción" type="textarea" rows="12" defaultValue={descripcionDefault}
                                onChange={(e) => setDescripcion(e.target.value)} />
                        </FormGroup>
                    </>

                {/* Propietario */}
                    <>
                        <div className="wbold">** Propietario:</div>
                        <FormGroup>
                            <Input type="select" onChange={(e) => setPropietario(e.target.value)} invalid={propietarioInvalida} >
                                <option value="" disabled={propietario !== ""}>Seleccione:</option>
                                <option value="Jorge">Jorge</option>
                                <option value="Ana">Ana</option>
                                <option value="Ana y Jorge">Ana y Jorge</option>
                            </Input>
                            <FormFeedback>Dueño del producto (Jorge o Ana)</FormFeedback>
                        </FormGroup>
                        
                    </>
                {/* Cantidad */}
                    {!isCompuesto && <>
                        <div className="wbold">Cantidad en inventario:</div>
                        <FormGroup>
                            <Input placeholder="Cantidad" type="number" onChange={(e) => setCantidad(e.target.value)} min={0} />
                        </FormGroup>
                    </>}

                {/* Proveedor */}
                    {!isCompuesto && <>
                        <div className="wbold">Proveedor:</div>
                        <FormGroup>
                            <Input placeholder="Nombre del proveedor" type="text" onChange={(e) => setProveedor(e.target.value)} />
                        </FormGroup>
                    </>} 

                {/* Código */}
                    {!isCompuesto && <div>
                        <div className="wbold">Código proveedor:</div>
                        <FormGroup>
                            <Input placeholder="Código del producto" type="text" onChange={(e) => setCodigoProducto(e.target.value)} />
                        </FormGroup>
                    </div>}

                {/* Link de Compra */}
                {!isCompuesto && <div>
                        <div className="wbold">Link de compra:</div>
                        <FormGroup>
                            <Input value={linkCompra} placeholder="URL" type="text" onChange={(e) => setLinkCompra(e.target.value)} />
                        </FormGroup>
                    </div>}

                {/* Subido */}
                    <>
                    <div className="wbold">Subido a Mercadolibre:</div>
                        <FormGroup>
                            <Input type="select" onChange={(e) => setSubido(e.target.value)}>
                                <option value="" disabled={subido !== ""}>Seleccione:</option>
                                <option value={false} >No</option>
                                <option value={true}>Sí</option>
                            </Input>
                        </FormGroup>
                    </>
                </div>
                <Button onClick={() => {subirProducto()}} className="botonAmarillo" disabled={!dataCompleta || clickeado}>{loading ? <Spinner size="sm" /> : "Subir producto"}</Button>
            </Modal>
        </React.Fragment>
    );
}

export default ModalProducto;
