import React, { PureComponent } from 'react';
import { Container, Row, Col } from 'reactstrap';

class Inicio extends PureComponent {
	componentDidMount() {
		var containers = document.getElementsByClassName('container-fluid');

		window.addEventListener('resize', function(e) {
			for (let container of containers) {
				container.style['height'] = `${window.innerHeight - 91}px`;
			}
		});
		for (let container of containers) {
			container.style['height'] = `${window.innerHeight - 91}px`;
		}
	}

	render() {
		return (
			<Container
				fluid
				className={[this.props.className, "noselect"]}
				style={{
					backgroundImage: this.props.fondo,
					backgroundRepeat: 'no-repeat',
				}}
			>
				<Row className="h100" id={this.props.id}>
					{/*pantalla chica*/}
					<Col
						xs={12}
						className={this.props.padding || ' paddingPantallaEnorme'}
					>
						{this.props.children}
					</Col>
				</Row>
			</Container>
		);
	}
}

export default Inicio;
