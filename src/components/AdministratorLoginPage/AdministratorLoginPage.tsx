import React from "react";
import { Container, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignInAlt } from "@fortawesome/free-solid-svg-icons";

export default class AdministratorLoginPage extends React.Component {
    render() {
        return (
            <Container>
                <Card>
                    <Card.Body>
                        <Card.Title>
                            <FontAwesomeIcon icon= { faSignInAlt } /> Administrator login
                        </Card.Title>
                        <Card.Text>
                            Login form here.
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Container>
        );
    }
}