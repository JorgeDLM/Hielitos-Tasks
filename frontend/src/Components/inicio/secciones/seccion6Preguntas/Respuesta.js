import React from "react";
import { Col } from "reactstrap";
import { FaCircle } from 'react-icons/fa'

class Respuesta extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			active: false
		};
		this.active = this.active.bind(this);
	}

	active = () => {
		this.setState({ active: !this.state.active });
	};

	render() {
		return (
			<React.Fragment>
				<Col onClick={this.active} xs={12} sm={{ size: 8, offset: 2 }}>
				<span className="d-inline"><FaCircle/></span>
					<div className="wbold d-inline"> {this.props.pregunta} </div>

					{this.state.active && (
						<div className="linkNegro tchica">
							{this.props.children}
						</div>
					)}
					<div className="lchica fondoNegro" />
				</Col>
			</React.Fragment>
		);
	}
}

export default Respuesta;
