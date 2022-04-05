import React, { useEffect, useState } from "react";
import { Button, Modal, Input, FormGroup, FormFeedback, Spinner } from "reactstrap";
import swal from 'sweetalert';
import logo from '../../../imgs/logoNegro.png'
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase-config';

function Admin() {

    const [modal, setModal] = useState(false)
    const [imagen, setImagen] = useState("")
    const [nombre, setNombre] = useState("")
    const [categoria, setCategoria] = useState("seleccione")
    const [subCategoria, setSubCategoria] = useState("seleccione")
    const [categorias, setCategorias] = useState([])
    const [subCategorias, setSubCategorias] = useState([])
    const [tematica, setTematica] = useState("")
    const [precio_compra, setPrecioCompra] = useState("")
    const [precio_venta, setPrecioVenta] = useState("")
    const [envio, setEnvio] = useState("seleccione")
    const [medidas, setMedidas] = useState("")
    const [descripcion, setDescripcion] = useState("")
    const [cantidad, setCantidad] = useState("")
    const [proveedor, setProveedor] = useState("")
    const [propietario, setPropietario] = useState("seleccione")
    const [loading, setLoading] = useState("")



    const imagenInvalida = !imagen
    const nombreInvalido = !nombre
    const categoriaInvalida = categoria === "seleccione"
    const subCategoriaInvalida = subCategoria === "seleccione"
    const tematicaInvalida = !tematica
    const precio_compraInvalido = !precio_compra
    const precio_ventaInvalido = !precio_venta
    const envioInvalido = envio === "seleccione"
    const medidasInvalidas = !medidas
    const descripcionInvalida = !descripcion
    const cantidadInvalida = !cantidad
    const proveedorInvalido = !proveedor
    const propietarioInvalida = propietario === "seleccione"

    const clearInputs = () => {
        setModal(true)
        setImagen("")
        setNombre("")
        setCategoria("seleccione")
        setTematica("")
        setPrecioCompra("")
        setPrecioVenta("")
        setEnvio("seleccione")
        setMedidas("")
        setDescripcion("")
        setCantidad("")
        setProveedor("")
        setPropietario("seleccione")
    }

    const dataCompleta =  !imagenInvalida && !nombreInvalido && !categoriaInvalida && !tematicaInvalida && !precio_ventaInvalido && !envioInvalido && !propietarioInvalida

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

        if (img.type === "image/png" || img.type === "image/jpeg" || img.type === "image/jpg"){
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
            .catch((err) => {
                console.log(err);
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
                imagen: imagen ? imagen : "",
                nombre: nombre ? nombre : "",
                categoria: categoria ? categoria : "",
                tematica: tematica ? tematica : "",
                precio_compra: precio_compra ? precio_compra : "",
                precio_venta: precio_venta ? precio_venta : "",
                envio: envio ? envio : false,
                ganancia: precio_venta - precio_compra - (precio_venta >= 299 ? (envio === true ? 72 : 0) : (envio === true ? 100 : 0)),
                medidas: medidas ? medidas : "",
                descripcion: descripcion ? descripcion : "",
                cantidad: cantidad ? cantidad : "",
                proveedor: proveedor ? proveedor : "",
                propietario: propietario ? propietario : "",
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
            setLoading(false);
            clearInputs("")

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
        if(categoria !== "seleccione"){
            set()
        }
        setLoading(false)
        
        }, [categoria, categorias])


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
                    <div className="wbold">Imagen:</div>
                    <FormGroup>
                        <Input type="file" nombre="img" accept="image/*" onChange={(e) => postImagen(e.target.files[0])} invalid={imagenInvalida} />
                        <FormFeedback>Ingrese una imagen</FormFeedback>
                    </FormGroup>

                {/* Nombre */}
                    <div className="wbold">Nombre:</div>
                    <FormGroup>
                        <Input placeholder="Nombre" type="text" onChange={(e) => setNombre(e.target.value)} invalid={nombreInvalido} />
                        <FormFeedback>Ingrese un nombre</FormFeedback>
                    </FormGroup>

                {/* Categoria */}
                    <div className="wbold">Categoria:</div>
                    <FormGroup>
                        <Input type="select" onChange={async(e) => {setCategoria(e.target.value); setLoading(true)}} invalid={categoriaInvalida} >
                            <option value="seleccione" disabled={categoria !== "seleccione"}>Seleccione:</option>
                            {categorias?.map((c, i) => <option key={i} id={c.id} value={c.categoria}>{c.categoria}</option>)}
                        </Input>
                        <FormFeedback>Seleccione una categoria</FormFeedback>
                    </FormGroup>

                {/* SubCategoria */}
                   {loading ? <div className="centro"><Spinner className="azul" size="sm" /></div> :  
                   subCategorias.length >= 1 && <>
                        <div className="wbold">Sub-categoria:</div>
                        <FormGroup>
                            <Input type="select" onChange={(e) => setSubCategoria(e.target.value)} invalid={subCategoriaInvalida} >
                                <option value="seleccione" disabled={subCategoria !== "seleccione"}>Seleccione:</option>
                                {subCategorias?.map((c, i) => <option key={i} id={c.id} value={c.sub_categoria}>{c.sub_categoria}</option>)}
                            </Input>
                            <FormFeedback>Seleccione la sub-categoria</FormFeedback>
                        </FormGroup>
                    </>}

                {/* Temática */}
                    <div className="wbold">Temática:</div>
                    <FormGroup>
                        <Input placeholder="Temática" type="text" onChange={(e) => setTematica(e.target.value)} invalid={tematicaInvalida} />
                        <FormFeedback>Ingrese una temática</FormFeedback>
                    </FormGroup>

                {/* Precio de compra */}
                    <div className="wbold">Precio de compra:</div>
                    <FormGroup>
                        <Input placeholder="Precio de compra" type="text" onChange={(e) => setPrecioCompra(e.target.value)} invalid={precio_compraInvalido} />
                        <FormFeedback>Ingrese un precio de compra</FormFeedback>
                    </FormGroup>

                {/* Precio de venta */}
                    <div className="wbold">Precio de venta:</div>
                    <FormGroup>
                        <Input placeholder="Precio de venta" type="text" onChange={(e) => setPrecioVenta(e.target.value)} invalid={precio_ventaInvalido} />
                        <FormFeedback>Ingrese un precio de venta</FormFeedback>
                    </FormGroup>

                {/* Envio */}
                    <div className="wbold">Envio:</div>
                    <FormGroup>
                        <Input type="select" onChange={(e) => setEnvio(e.target.value)} invalid={envioInvalido} >
                            <option value="seleccione" disabled={envio !== "seleccione"}>Seleccione:</option>
                            <option value={true}>Sí</option>
                            <option value={false}>No</option>
                        </Input>
                        <FormFeedback>¿Envio incluido en precio de venta?</FormFeedback>
                    </FormGroup>

                {/* Medidas */}
                    <div className="wbold">Medidas:</div>
                    <FormGroup>
                        <Input placeholder="Medidas" type="text" onChange={(e) => setMedidas(e.target.value)} invalid={medidasInvalidas} />
                        <FormFeedback>Ingrese medidas</FormFeedback>
                    </FormGroup>

                {/* Descripción */}
                    <div className="wbold">Descripción:</div>
                    <FormGroup>
                        <Input placeholder="Descripción" type="textarea" rows="12" defaultValue={`*********************************************************************************************************
                            ¡Publicación ${nombre} de ${tematica}!
                            *********************************************************************************************************

                            Material: 
                            Tipo: ${subCategoria}
                            Tamaño de espada: ${medidas}


                            *********************************************************************************************************
                            Contamos con más ${categoria} de ${tematica}, si buscabas algo en especial contáctanos! Recuerda que en tu compra de $299 o más el envió es gratis! Si tienes dudas estaremos para resolverte.
                            *********************************************************************************************************`}
                            onChange={(e) => setDescripcion(e.target.value)} invalid={descripcionInvalida} />
                        <FormFeedback>Ingrese una descripción</FormFeedback>
                    </FormGroup>

                {/* Cantidad */}
                    <div className="wbold">Cantidad:</div>
                    <FormGroup>
                        <Input placeholder="Cantidad" type="number" onChange={(e) => setCantidad(e.target.value)} invalid={cantidadInvalida} />
                        <FormFeedback>Ingrese cantidad en inventario</FormFeedback>
                    </FormGroup>

                {/* Proveedor */}
                    <div className="wbold">Proveedor:</div>
                    <FormGroup>
                        <Input placeholder="Proveedor" type="text" onChange={(e) => setProveedor(e.target.value)} invalid={proveedorInvalido} />
                        <FormFeedback>Nombre del proveedor</FormFeedback>
                    </FormGroup>

                {/* Propietario */}
                    <div className="wbold">Propietario:</div>
                    <FormGroup>
                        <Input type="select" onChange={(e) => setPropietario(e.target.value)} invalid={propietarioInvalida} >
                            <option value="seleccione" disabled={propietario !== "seleccione"}>Seleccione:</option>
                            <option value="Jorge">Jorge</option>
                            <option value="Ana">Ana</option>
                        </Input>
                        <FormFeedback>Dueño del producto (Jorge o Ana)</FormFeedback>
                    </FormGroup>
                </div>
                <Button onClick={() => subirProducto()} className="botonAmarillo" disabled={!dataCompleta}>{loading ? <Spinner size="sm" /> : "Subir producto"}</Button>
            </Modal>
        </React.Fragment>
    );
}

export default Admin;
