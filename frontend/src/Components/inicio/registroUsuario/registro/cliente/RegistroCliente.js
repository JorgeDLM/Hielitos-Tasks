import React, { Component } from "react";
import AreaRegistroCliente from "./componentes/AreaRegistroCliente";
import Menu from "../../../menuInicio/MenuInicio"

class Cliente extends Component {

  render() {
    return (
      <div className="noselect">
          <Menu hrefLogo="/" className="fondoBlanco" chico blanco />{" "}
          <div className="pabmuygrande">
              <AreaRegistroCliente />
          </div>
      </div>
    );
  }
}

export default Cliente;
