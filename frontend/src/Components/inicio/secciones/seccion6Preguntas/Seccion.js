import React, {useState} from "react";
import { Row, Col, Input } from "reactstrap";
import Frame from "../../secciones/frameFullPage/Frame";
import Respuesta from "./Respuesta";
import Fuse from 'fuse.js'

function Inicio(props) {
	const [query, setQuery] = useState('')



	const preguntas = [
		{pregunta: "Horarios de entrega", respuesta: "- Entregamos de 8:00am hasta 5:00pm."},
		{pregunta: "¿Cómo empiezo a pedir?", respuesta: "- Date de alta y nosotros de contactaremos lo antes posible."},
		{pregunta: "¿Entregan en mi zona?", respuesta: <>- Entregamos en Puebla, Cholula y alrededores. Si buscabas una zona diferente{' '}<a href="/#contacto">escríbenos</a>, nos encantará atenderte..</>	},
		{pregunta: "Cuál es el monto de pedido mínimo?", respuesta: <>- El pedido mínimo ahora es de $1,000.00 por entrega, estamos trabajando para tener más flexibilidad, cualquier cosa no dudes en{" "}<a href="/#contacto">contactárnos</a>.</>	},
		{pregunta: "¿Formas de pago?", respuesta: <>- El pago dependerá del que acepte tu socio asignado, sin embargo, de preferencia pedimos sea vía transferencia o en efectivo, cualquier duda no dudes en{" "}<a href="/#contacto">contactárnos</a>.</>},
		{pregunta: "¿Quién me entregará mi pedido?", respuesta: <>- Buscaremos al proveedor más adecuado para ti, dependiendo de tu zona y de tu negocio.</>},
		{pregunta: "Quiero cambiar de socio, ¿qué hago?", respuesta: <>- Si quieres cambiar de socio primero tienes que liquidar tu adeudo con él. Una vez hayas liquidado el adeudo total{" "} <a href="/#contacto">contáctanos</a> para realizar tu reasignación.</>},
		{pregunta: "¿Dan crédito?", respuesta: <>- Esto debe tratarse directamente con tu socio asignado, aunque recompensamos a quién paga contra entrega, cualquier cosa no dudes en{" "}<a href="/#contacto">contactárnos</a>.</>},
		{pregunta: "¿Qué pasa si un producto me llega mal?", respuesta: <>- Si un producto llega mal nosotros nos encargamos de que este se te cambie, siempre y cuando este sea reportado en el momento de la entrega. Posterior a la entrega no habrá devoluciones.</>},
		{pregunta: "No ha llegado mi pedido, ¿qué hago?", respuesta: <>- Desde tu portal puedes monitorear el estado en el que se encuentra tu pedido (en la pestaña de pedidos), a veces el tráfico puede atrasar un poco las entregas les pedimos sean pacientes. Sin embargo, si algo surge no duden en{" "} <a href="/#contacto">contactárnos</a>.</>},
		{pregunta: "¿Puedo cancelar mi pedido?", respuesta: <>- Sí, siempre y cuando lo hagas al menos con un día de anticipación. No se podrá cancelar en el mismo día en que se entrega.</>},
		{pregunta: "Necesito producto para hoy, ¿qué hago?", respuesta: <>- No se puede pedir dentro del mismo día, esperamos pronto contar con esta modalidad.</>},
	]

	const fuse = new Fuse(preguntas, {
		keys: ["pregunta"],
		threshold: .3,
	  })
	
	const busqueda = fuse.search(query) 
	const preguntasFuse = query ? busqueda.map(resultado => resultado.item) : preguntas.sort((a, b) => (a.nombre > b.nombre) ? 1 : -1)

	// const data = preguntas.map((p, i) => <Respuesta key={i} pregunta={p.pregunta}><div className="letraRespuesta">{p.respuesta}</div></Respuesta> )

	return (
		<React.Fragment>
			<Frame
				id={props.id}
				className={props.className || " fondoRojo"}
				clase="botonAmarillo"
				fondo='url("https://scontent.fpbc2-2.fna.fbcdn.net/v/t1.0-9/57006280_10161779272055512_3416204226890563584_o.jpg?_nc_cat=106&_nc_ht=scontent.fpbc2-2.fna&oh=039264c39a497e5224961ef4b489743d&oe=5D4E23B1")'
			>
				<section className=" parenorme negro">
					<Row>
						<Col
							xs={12}
							sm={{ size: 8, offset: 2 }}
							className="wbold letraBuscadorAyuda"
						>
							¿Cómo te podemos ayudar?
						</Col>
						<Col
							xs={8}
							sm={{ size: 6, offset: 2 }}
							md={{ size: 5, offset: 2 }}
						>
							<Input type="search" placeholder="Buscar" value={query} onChange={e => {setQuery(e.target.value)}} />
						</Col>
					</Row>
					<Row className="parmediano letraPregunta">
						{preguntasFuse.sort((a, b) => (a.nombre > b.nombre) ? 1 : -1).map((p, i) => (
							<React.Fragment  key={i}>
								<Respuesta pregunta={p.pregunta}><div className="letraRespuesta">{p.respuesta}</div></Respuesta>
                    		</React.Fragment>
						))}
					</Row>
				</section>
			</Frame>
		</React.Fragment>
	);
}


export default Inicio;
