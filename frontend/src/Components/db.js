

TODO DENTRO DE CARPETA BACKEND
Server.js
	Const express = require(“express”)
	Const dotenv = require(“dotenv”)
	Const app = express()
	Const PORT = process.env.PORT || 5000
//si el Puerto del doc .env no se encuentra entonces sera el 5000 de localhost                
	App.get(“/”, (req, res) => { res.send(“API funcionando”)}
	App.listen(5000,console.log(“server iniciado en Puerto 5000”)

Package.json
	“scripts”: { start: “nodemon backend/server.js }
//esto es para que cuando se actualice el servidor que no tenga que resetearlo manualmenteç

.env
	PORT = 5000
// supongo que aquí tienes que poner el puerto del servidor real
//para que funcione tengo que instalar dotenv -> npm i –save dotenv


PARA CACHEAR informacion:
//se usa useeffect para que cargue la info tan pronto cargue la pagina
	useEffect(() => {
		const productosCache = localStorage.getItem(‘productos’)
		setProductosCache(productosCache ? json.parse (productosCache) : []) 
}

Agregar al formulario de producto onSubmit y onEnter para que cuando den enter o algo se agregue al ticket y sea mas facil




Jsons de DB carpeta data:
data.js



Const tipo_de_pago {
	Id
	nombre
}

Const pedido {
Id
Cliente
Socio
Productos {
	producto
}
Total
estado
Factura
Pagado
Fecha_de_entrega
Tipo_de_pago
Ubicación_de_entrega
Created_at
	}
	

Const ubicación_de_entrega {
Id
Nombre
Calle
Numero
Colonia
Ciudad
Estado
CP
	}










