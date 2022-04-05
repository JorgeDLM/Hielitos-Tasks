import React from 'react';
import { Container, Col, Row, Badge } from 'reactstrap';
import { Link } from 'react-router-dom';
import logo from '../../imgs/logoBlanco.png';

export default props => (
  <Container className={props.color || 'fondoRojo'} fluid>
    <Row className="py-4">
      <Col xs={{ size: 6, offset: 3 }}>
        <Link to={props.to || '/'}>
          <img src={logo} alt="" className="img-fluid" />
        </Link>
      </Col>
    </Row>
    <Row className="justify-content-center">
      <Col xs={{ size: 6 }}>
        <h1 className="display-1 text-white text-center">404</h1>
      </Col>
    </Row>
    <Row className="justify-content-center">
      <Col xs={{ size: 6 }}>
        <h2 className="text-white text-center">
          La pagina que buscas no existe
        </h2>
      </Col>
    </Row>
    <Row className="my-4 justify-content-center">
      <Col>
        <h2 className="text-dark text-center">
          <Badge color="light" tag={Link} to={props.to || '/'}>
            {props.root || 'Inicio'}
          </Badge>
        </h2>
      </Col>
    </Row>
  </Container>
);
