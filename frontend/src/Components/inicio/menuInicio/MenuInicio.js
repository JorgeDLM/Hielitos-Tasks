import React, { PureComponent } from "react";
// import { NavLink } from "react-router-dom";
import { Navbar, NavbarBrand, Nav, NavItem, NavLink } from "reactstrap";
import { NavbarToggler, Collapse } from 'reactstrap';
import logo from "../../../imgs/logoBlanco.png";
import logo2 from "../../../imgs/logoNegro.png";
import { FaUser, FaUndo } from "react-icons/fa";
import IniciarSesionModal from "../iniciarSesion/LoginModal";

class Menu extends PureComponent {
  constructor(props) {
      super(props);
      this.state = {
          isOpen: false, 
      };
      this.toggle = this.toggle.bind(this);
  }

	toggle() {
    this.setState({
      isOpen: !this.state.isOpen,
		});
	}

  // para hacer que se cierre el menu cuando se pique fuera pero tendria que envolver el renderizado clickeable
  // handleDocumentClick(e) {
  //   const container = this._element;
  //   if (e.target !== container && !container.contains(e.target)) {
  //     this.setState({isOpen: false});
  //   }
  // }


  render() {
        // TODO: Falta una funcion que calcule en el resize el tamaño de la pantalla
        let windowSize = window.innerWidth
  
        let toggleNavbar = windowSize <= 768 &&  this.toggle
    return (
      <React.Fragment>
        <Navbar
          light
          expand="md"
          fixed={this.props.fixed || "top"}
          className={`${this.props.className} hMenu noselect`}
        >
          <NavbarBrand href={this.props.hrefLogo} className="logoMenu">
            {!this.props.blanco && (
              <img src={logo} className="mercadologo" alt="logo" />
            )}
            {this.props.blanco && (
              <img
                src={logo2}
                className="mercadologo"
                alt="logo"
              />
            )}
          </NavbarBrand>
          <NavbarToggler className="burgerMenu" onClick={toggleNavbar} />
          <Collapse isOpen={this.state.isOpen} navbar>
            {!this.props.chico && (
              <Nav className={`${this.props.blanco ? "collapseMenuBlanco" : "collapseMenuNegro"} ml-auto`} navbar id="navnav">
                {this.props.fullpage && (<NavItem className="parchico d-block d-md-none">
                  <NavLink className="navHighlight"  onClick={toggleNavbar}>
                    <IniciarSesionModal otro>
                      <FaUser className="negro" /> Iniciar sesión
                    </IniciarSesionModal>
                  </NavLink>
                </NavItem>)}
                {/* MAPEADO DE LINKS: */}
                {this.props.links.map((link, i) => (
                <NavItem id={link.id} data-menuanchor={link.href}>
                  <NavLink className="navHighlight" href={`#${link.href}`}  onClick={toggleNavbar}>
                    {link.nombre}
                  </NavLink>
                </NavItem>
                ))}
                {(this.props.fullpage && <NavItem className="d-none d-md-block">
                    <NavLink className="navHighlight"  onClick={toggleNavbar}>
                      <IniciarSesionModal otro>
                        <FaUser className="negro" /> Iniciar sesión
                      </IniciarSesionModal>
                    </NavLink>
                  </NavItem>)}
              </Nav>
            )}
            {/* menu corto para recuperar contraseña y registro */}
            {this.props.chico &&(
              <Nav className={`${this.props.blanco ? "collapseMenuBlanco" : "collapseMenuNegro"} w100`} navbar id="navnav">
                {!this.props.soloVolver && <NavItem className="parchico d-block d-md-none">
                      <NavLink className={this.props.blanco ? "linkMenuBlanco" : "linkMenuNegro"}   onClick={toggleNavbar}>
                          <IniciarSesionModal otro>
                              <FaUser className={this.props.blanco ? "negro" : "blanco"} /> &nbsp;Iniciar sesión
                          </IniciarSesionModal>
                      </NavLink>
                    </NavItem>
                  }
                  <NavItem className={`${windowSize >= 767 && (!this.props.soloVolver ? "widthLinkMenu d-flex align-items-end flex-column" : "widthLinkMenu2 d-flex align-items-end flex-column" )}`}>
                      <NavLink className={this.props.blanco ? "linkMenuBlanco" : "linkMenuNegro"} href="/"   onClick={toggleNavbar}>
                      <FaUndo className={this.props.blanco ? "negro" : "blanco"} />&nbsp;&nbsp; Volver a inicio
                      </NavLink>
                  </NavItem>
                  {!this.props.soloVolver && 
                    <NavItem className="d-none d-md-block">
                      <NavLink className={`${this.props.blanco ? "linkMenuBlanco" : "linkMenuNegro"}`}   onClick={toggleNavbar}>
                          <div className="">
                              <IniciarSesionModal otro>
                                  <FaUser className={this.props.blanco ? "negro" : "blanco"} /> Iniciar sesión
                              </IniciarSesionModal>
                          </div>
                      </NavLink>
                    </NavItem>
                  }
                </Nav>
            )}
          </Collapse>
        </Navbar>
      </React.Fragment>
    );
  }
}
export default Menu;
