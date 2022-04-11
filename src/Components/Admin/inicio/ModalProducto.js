import React, { useContext, useEffect, useState } from "react";
import { Button, Modal, Input, FormGroup, FormFeedback, Spinner, Card, InputGroup } from "reactstrap";
import swal from 'sweetalert';
import logo from '../../../imgs/logoNegro.png'
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase-config';
import UsuarioContext from "../context/UsuarioContext";
import Fuse from 'fuse.js'
import ProductoCompuesto from "./ProductoCompuesto";
import NumberFormat from "react-number-format";
import {FaSearch, FaExclamationTriangle} from 'react-icons/fa'

function ModalProducto() {

    const {productos, setProductos} = useContext(UsuarioContext)

    const [modal, setModal] = useState(false)
    const [imagen, setImagen] = useState("")
    const [nombre, setNombre] = useState("")
    const [titulo, setTitulo] = useState("")
    const [tituloDefault, setTituloDefault] = useState("")
    const [categoria, setCategoria] = useState("")
    const [subCategoria, setSubCategoria] = useState("")
    const [categorias, setCategorias] = useState([])
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
    
    const [query, setQuery] = useState("")
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


    const imagenInvalida = !imagen
    const nombreInvalido = !nombre
    const tituloInvalido = !nombre
    const categoriaInvalida = categoria === ""
    const subCategoriaInvalida = subCategoria === ""
    const precio_compraInvalido = !precio_compra
    const precioInvalido = !isCompuesto ? ((precio_venta - precio_compra) <= 0) : false
    const precio_ventaInvalido = !isCompuesto ? (!precio_venta || (precioInvalido)) : !precio_venta
    const precio_venta_mlInvalido = !isCompuesto ? (!precio_venta_ml || ((precio_venta_ml - precio_compra) <= 0)) : false
    const precio_venta_mayoreoInvalido = !isCompuesto ? (!precio_venta_mayoreo || ((precio_venta_mayoreo - precio_compra) <= 0)) : false
    const precioEnvio = !isCompuesto ? ((precio_venta - precio_compra) < 70) : false
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
        setImagen("")
        setNombre("")
        setTitulo("")
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


// SUBIR PRODUCTO ------------------------------------------------------------
    const subirProducto = async() => {
        setLoading(true);
        if(!dataCompleta){
            swal({
                title: "Rellene todos los campos",
                text: "¿Te falta algo?",
                icon: "error",
                button: "cerrar"
            });
            setLoading(false);
            return
        }
        try {
            
// SUBIR PRODUCTO firebase: ---------------------------------------------------
            const data = {
                imagen: imagen,
                nombre: nombre,
                tematica: tematica ? tematica : "",
                titulo: titulo,
                codigo_universal: categorias?.filter(c => categoria === c.categoria)[0]?.codigo_universal,
                categoria: categoria,
                sub_categoria: subCategoria ? subCategoria : "",
                precio_compra: !isCompuesto ? precio_compra : "",
                precio_venta: precio_venta ? precio_venta : "",
                precio_venta_ml: precio_venta_ml ? precio_venta_ml : "",
                precio_venta_mayoreo: precio_venta_mayoreo ? precio_venta_mayoreo : "",
                envio: envio === "false" ? false : envio === "true" ? true : false,
                // ganancia: precio_venta - precio_compra - (precio_venta >= 299 ? (envio === true ? 72 : 0) : (envio === true ? 100 : 0)),
                medidas: medidas ? medidas : "",
                material: material ? material : "",
                descripcion: descripcion ? descripcion : descripcionDefault,
                cantidad: cantidad ? cantidad : 0,
                proveedor: !isCompuesto ? proveedor : "",
                propietario: propietario ? propietario : "",
                subido: subido === "false" ? false : subido === "true" ? true : false,
                codigo_producto: !isCompuesto ? codigo_producto : "",
                compuesto: isCompuesto ? compuesto : [],
                comentario: "",
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
    }, [])

    
    
    // FETCH SUBCATEGORIAS
    useEffect(() => {
        const categoriaID = categorias?.filter(c => categoria === c.categoria)[0]?.id
        const set = async () => {
            const dataSubCategoria =  await getDocs(collection(db, "categorias", categoriaID, "sub_categorias"))
            const data = dataSubCategoria.docs.map(doc => ({id: doc.id, ...doc.data()}))
            setLoading(false)
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
        setTituloDefault(`${nombre}${tematicaTrue ? ` - ${tematica}` : ""}`)
    }

    const crearDescripcion = () => {
        setDescripcionDefault(
`*********************************************************************************************************
¡PUBLICACIÓN POR ${nombre.toUpperCase()} ${tematica && "DE "}${tematica.toUpperCase()}!
*********************************************************************************************************

Material: ${material}
Tipo: ${!subCategoria ? categoria : subCategoria}
Tamaño: ${medidas}


*********************************************************************************************************
Contamos con más ${categoria} de ${tematica}, si buscabas algo en especial contáctanos! Recuerda que en 
tu compra de $299 o más el envió es gratis! Si tienes dudas estaremos para resolverte.
*********************************************************************************************************`)}


const fuse = new Fuse(productos, {
    keys: [{name:"nombre", weight: 0.7}, {name:"categoria", weight: 0.15}, {name:"sub-categoria", weight: 0.1}, {name:"propietario", weight: 0.05}],
    threshold: 0.4,
    includeScore: true,
    shouldSort: true,
  })
  
const busqueda = fuse.search(query) 
const productosFuse = query ? busqueda.map(resultado => resultado.item) : productos.sort((a, b) => (a.nombre > b.nombre) ? 1 : -1)

    return (
        <React.Fragment>
            <Button onClick={() => setModal(!modal)} className="botonNegro">Agregar producto</Button>
            <Modal isOpen={modal} toggle={() => setModal(!modal)}> 
                <div className="pargrande azul wbolder centro tmuygrande">
                    {imagen === "" ? 
                        (<img className="productoLista" src={logo} alt="Error" />)
                        :
                        (<img className="productoLista" src={imagen} alt="Error" />)
                    }
                </div>
                <div className="pmediano">

                {/* Imagen */}
                    <>
                        <div className="wbold">** Imagen:</div>
                        <FormGroup>
                            <Input type="file" nombre="img" accept="image/*" onChange={(e) => postImagen(e.target.files[0])} invalid={imagenInvalida} />
                            <FormFeedback>Ingrese una imagen</FormFeedback>
                        </FormGroup>
                    </>

                {/* Nombre */}
                    <>
                        <div className="wbold">** Nombre:</div>
                        <FormGroup>
                            <Input onBlur={() => {crearTitulo(); crearDescripcion()}} placeholder="Nombre corto" type="text" maxLength={60} onChange={(e) => setNombre(e.target.value)} invalid={nombreInvalido} />
                        </FormGroup>
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
                        <FormGroup>
                            <Input 
                                defaultValue={tituloDefault}
                                // value={titulo}
                                placeholder="Título de la publicación" 
                                type="text" 
                                maxLength={60} 
                                onChange={(e) => setTitulo(e.target.value)} 
                                invalid={tituloInvalido} />
                        </FormGroup>
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
                            <span className="pdemuychico wbold pizmediano">Sí </span> <Input type="checkbox" onChange={() => setIsCompuesto(!isCompuesto)} />
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
                                {precio_venta < 299 && <option value={false} >No</option>}
                                {precio_venta >= 250 && <option value={true}>Sí</option>}
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
                            </Input>
                            <FormFeedback>Dueño del producto (Jorge o Ana)</FormFeedback>
                        </FormGroup>
                        
                    </>
                {/* Cantidad */}
                    <>
                        <div className="wbold">Cantidad en inventario:</div>
                        <FormGroup>
                            <Input placeholder="Cantidad" type="number" onChange={(e) => setCantidad(e.target.value)} min={0} />
                        </FormGroup>
                    </>

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
                            <Input placeholder="Código del producto" checked={isCompuesto} type="text" onChange={(e) => setCodigoProducto(e.target.value)} />
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
                <Button onClick={() => subirProducto()} className="botonAmarillo" disabled={!dataCompleta}>{loading ? <Spinner size="sm" /> : "Subir producto"}</Button>
            </Modal>
        </React.Fragment>
    );
}

export default ModalProducto;
