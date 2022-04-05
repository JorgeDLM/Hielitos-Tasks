import React from 'react';
import { Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import { FaQuestionCircle } from 'react-icons/fa';

class ComponenteExplicacion extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      collapse: false,
      popoverOpen: false,
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle = () => {
    this.setState({ popoverOpen: !this.state.popoverOpen });
  };

  render() {
    return (
      <div className={`${this.props.className} ${this.props.clase}`}>
            <FaQuestionCircle
              id="Popover1"
              onClick={this.toggle}
              className={`${this.props.clase} mouseSelectClick tmuygrande amarillo d-inline`}
            />
        <Popover
          placement="bottom"
          isOpen={this.state.popoverOpen}
          target="Popover1"
          toggle={this.toggle}
          className="pdemediano"
        >
          <PopoverHeader>{this.props.titulo || "¿Cómo funciona?"}</PopoverHeader>
          <PopoverBody>{this.props.children}</PopoverBody>
        </Popover>
      </div>
    );
  }
}

export default ComponenteExplicacion;
