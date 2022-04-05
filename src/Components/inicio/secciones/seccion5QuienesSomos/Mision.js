import React, { PureComponent } from "react";
import { Row, Col, Collapse } from "reactstrap";
import { FaPlus, FaMinus } from "react-icons/fa";

class Inicio extends PureComponent {
	render() {
		return (
			<React.Fragment>
				{/*pantalla xs chica*/}
				<Row onClick={this.props.onClick}>
					<Col xs={{ size: 6, offset: 3 }}>
						{this.props.mision && (
							<div
								onClick={() => {
									if (this.props.val !== this.props.actual) {
										this.props.setOpen(this.props.val);
									} else {
										this.props.setOpen(this.props.sig);
									}
								}}
								className={
									this.props.color +
									" tgrande d-inline icon-mision-1"
								}
							/>
						)}{" "}
						{this.props.mision && (
							<div
								onClick={() => {
									if (this.props.val !== this.props.actual) {
										this.props.setOpen(this.props.val);
									} else {
										this.props.setOpen(this.props.sig);
									}
								}}
								className={
									this.props.color +
									" tmuygrande wbold centradoIcono d-inline"
								}
							>
								Misión
							</div>
						)}
						{this.props.vision && (
							<div
								onClick={() => {
									if (this.props.val !== this.props.actual) {
										this.props.setOpen(this.props.val);
									} else {
										this.props.setOpen(this.props.sig);
									}
								}}
								className={
									this.props.color +
									" tgrande d-inline icon-vision-1"
								}
							/>
						)}{" "}
						{this.props.vision && (
							<div
								onClick={() => {
									if (this.props.val !== this.props.actual) {
										this.props.setOpen(this.props.val);
									} else {
										this.props.setOpen(this.props.sig);
									}
								}}
								className={
									this.props.color +
									" tmuygrande wbold centradoIcono d-inline"
								}
							>
								Vision
							</div>
						)}
						{this.props.valores && (
							<div
								onClick={() => {
									if (this.props.val !== this.props.actual) {
										this.props.setOpen(this.props.val);
									} else {
										this.props.setOpen(this.props.sig);
									}
								}}
								className={
									this.props.color +
									" tgrande d-inline icon-valores"
								}
							/>
						)}{" "}
						{this.props.valores && (
							<div
								onClick={() => {
									if (this.props.val !== this.props.actual) {
										this.props.setOpen(this.props.val);
									} else {
										this.props.setOpen(this.props.sig);
									}
								}}
								className={
									this.props.color +
									" tmuygrande wbold centradoIcono d-inline"
								}
							>
								Valores
							</div>
						)}
					</Col>
					{this.props.val !== this.props.actual && (
						<Col
							onClick={() => {
								if (this.props.val !== this.props.actual) {
									this.props.setOpen(this.props.val);
								} else {
									this.props.setOpen(this.props.sig);
								}
							}}
							className="d-block d-md-none d-md-none parmuychico"
						>
							<FaPlus className={this.props.color + " tchica"} />
						</Col>
					)}
					{this.props.val === this.props.actual && (
						<Col
							onClick={() => {
								if (this.props.val !== this.props.actual) {
									this.props.setOpen(this.props.val);
								} else {
									this.props.setOpen(this.props.sig);
								}
							}}
							className="d-block d-md-none d-md-none parmuychico"
						>
							<FaMinus className={this.props.color + " tchica"} />
						</Col>
					)}
				</Row>
				<React.Fragment>
					{/*pantalla xs chica*/}
					<Collapse isOpen={this.props.val === this.props.actual}>
						<Col
							xs={{ size: 10, offset: 1 }}
							className={this.props.className}
						>
							{this.props.children}
						</Col>
					</Collapse>
				</React.Fragment>
			</React.Fragment>
		);
	}
}

export default Inicio;
