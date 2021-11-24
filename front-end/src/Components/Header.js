import React from 'react';
import { Container, Navbar } from 'react-bootstrap';
import { FaStop, FaStopwatch } from 'react-icons/fa';

function Header(props) {

    return (
        <Navbar collapseOnSelect variant="dark" bg="dark" expand="lg">
            <Container fluid>
                <Navbar.Text><FaStopwatch size="30px" style={{color: 'white'}}/></Navbar.Text>
                <Navbar.Brand variant="secondary">
                    {props.title}
                </Navbar.Brand>
                <Navbar.Text><FaStopwatch size="30px" style={{color: 'white'}}/></Navbar.Text>
            </Container>
        </Navbar>
    )
}

export default Header
