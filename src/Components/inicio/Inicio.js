import React from "react";
import ReactFullpage from '@fullpage/react-fullpage';
import anime from 'animejs/lib/anime.es.js';
import Menu from './menuInicio/MenuInicio';
import Seccion1Portada from './secciones/seccion1Video/Seccion';
import Seccion2Imagenes from './secciones/seccion2MejorOpcion/Seccion';
import Seccion3Facil from './secciones/seccion3Facil/Seccion';
import Seccion4Zonas from './secciones/seccion4Zonas/Seccion';
// import Seccion5QuienesSomos from './secciones/seccion5QuienesSomos/Seccion';
import Seccion6Preguntas from './secciones/seccion6Preguntas/Seccion';
import Seccion7Contacto from './secciones/seccion7Contacto/Seccion';


class Inicio extends React.Component {


	componentDidMount() {
		window.scrollTo(0, 1);
	}

	sweepIn(origin, destination, direction) {
		if (destination.index === 2) {
			anime({
				targets: '.fadeIn2',
				opacity: 1,
				scale: 1.5,
				duration: 800,
			});

			anime({
				targets: '.fadeIn3',
				opacity: 1,
				scale: 1.5,
				duration: 800,
				delay: 800,
			});

			anime({
				targets: '.fadeIn4',
				opacity: 1,
				scale: 1.5,
				delay: 1600,
			});

			anime({
				targets: '.fadeIn5',
				opacity: 1,
				scale: 1.3,
				duration: 800,
				delay: 2400,
			});
		}
	}


	links = [
		{id:"inicio", nombre:"Inicio", href:"inicio"},
		{id:"tu-mejor-opcion", nombre:"Tu Mejor Opción", href:"tu-mejor-opcion"},
		// {id:"quienes-somos", nombre:"Quiénes Somos", href:"quienes-somos"},
		{id:"preguntas-frecuentes", nombre:"Preguntas Frecuentes", href:"preguntas-frecuentes"},
		{id:"contacto", nombre:"Contacto", href:"contacto"},
	]

  
  
  render() {
    return (
      <React.Fragment>
      {/* MENU */}
        <Menu className="fondoBlanco" links={this.links} fullpage blanco />
        {/* Contenido */}
        <ReactFullpage
					licenseKey="23D069B2-6B424173-ADAD6D62-6CB56498"
					controlArrows={true}
					anchors={[
						'inicio',
						'tu-mejor-opcion',
						'asi-de-facil',
						'zonas-de-entrega',
						// 'quienes-somos',
						'preguntas-frecuentes',
						'contacto',
					]}
					slideSelector=".fpage-slide"
					afterLoad={this.sweepIn}
					keyboardScrolling={true}
					menu="#navnav"
					render={({ state, fullpageApi }) => {
						return (
							<ReactFullpage.Wrapper>
								<Seccion1Portada fullpageApi={fullpageApi} className="hPage section" />
                				<Seccion2Imagenes className="fondoNegro hPage section" />
								<Seccion3Facil className="fondoAmarillo hPage section" />
								<Seccion4Zonas className="fondoAzul hPage section" />
								{/* <Seccion5QuienesSomos className="fondoBlanco hPage section" /> */}
								<Seccion6Preguntas className="fondoVerde hPage section" />
								<Seccion7Contacto className="fondoNegro hPage section" /> 
							</ReactFullpage.Wrapper>
						);
					}}
				/>
      </React.Fragment>
    );
  }
}

export default Inicio;