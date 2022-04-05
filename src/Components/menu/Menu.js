import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Navbar, NavbarBrand, Nav, NavItem } from "reactstrap";
import { NavbarToggler, Collapse } from 'reactstrap';
import logoBlanco from "../../imgs/logoBlanco.png";
import logoNegro from "../../imgs/logoNegro.png";
// import { signOut } from "firebase/auth";
// import { auth } from "../../firebase-config";

function Menu(props) {

  const [toggle, setToggle] = useState(false)


        // TODO: Falta una funcion que calcule en el resize el tamaño de la pantalla
        const windowSize = window.innerWidth
  
        const toggleNavbar = () => {
          windowSize <= (props.expand ? 1700 : 768) &&  setToggle(!toggle)
        } 
        
      //   // CERRAR SESION FIREBASE
      //   const cerrarSesionFB = async() => {
      //     await signOut(auth)
      //   }

      //   const cerrarSesion = () => {
      //     cerrarSesionFB()
      //     localStorage.removeItem("infoUsuario")
      // }
        
    return (
      <React.Fragment>
        <Navbar
          light
          expand={props.expand ? props.expand : "md"}
          fixed={props.fixed || "top"}
          className={`${props.rojo ? "fondoRojo" : props.negro ? "fondoNegro" :  props.rojo ? "fondoRojo": props.blanco ? "fondoAzul" :  props.verde ? "fondoVerde": "fondoBlanco"} hMenu noselect`}
        >
          <NavbarBrand href={props.hrefLogo} className="logoMenu">
            {!props.logoBlanco && (
              <img src={logoNegro} className="mercadologo" alt="logo" />
            )}
            {props.logoBlanco && (
              <img
                src={logoBlanco}
                className="mercadologo"
                alt="logo"
              />
            )}
          </NavbarBrand>
          <NavbarToggler className="burgerMenu" onClick={() => toggleNavbar()} />
          <Collapse isOpen={toggle} navbar>
              <Nav className={`${props.rojo ? "collapseMenuRojo" : props.negro ? "collapseMenuNegro" : "collapseMenuBlanco"} ml-auto`} navbar id="navnav">
                {/* MAPEADO DE LINKS: */}
                {props.links.map((link, i) => (
                  <NavItem key={i} className="pabItemsMenu">
                    <NavLink className="navHighlightBlancoMenu" to={`${link.path}`}  onClick={() => toggleNavbar()}>
                      {link.nombre}
                    </NavLink>
                  </NavItem>
                ))}
                {/* <hr className="fondoBlanco d-block d-md-none" />
                  <NavItem className="pabMenu">
                      <NavLink className="navHighlightBlancoMenu"  onClick={() => {toggleNavbar(); cerrarSesion()}}  to='/'>
                        Cerrar sesión
                      </NavLink>
                  </NavItem> */}
              </Nav>
            {/* menu corto para recuperar contraseña y registro */}
          </Collapse>
        </Navbar>
      </React.Fragment>
    );
}
export default Menu;
