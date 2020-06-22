import React from "react";
import { Container, Card, Form, Button, Col, Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import api, { ApiResponse, saveToken, saveRefreshToken } from '../../api/api';
import { Redirect } from "react-router-dom";

interface AdministratorLoginPageState {
    email: string;
    password: string;
    errorMessage: string;
    isLoggedIn: boolean;
}

export default class AdministratorLoginPage extends React.Component {
    state: AdministratorLoginPageState;

    constructor(props: Readonly<{}>) {
        super(props);

        this.state = {
            email: '',
            password: '',
            errorMessage: '',
            isLoggedIn: false
        }
    }

    private formInputChanged(event: React.ChangeEvent<HTMLInputElement>){
        const newState = Object.assign(this.state, {
            [ event.target.id ]: event.target.value
        });

        this.setState(newState);
    }

    private setErrorMessage(message: string){
        const newState = Object.assign(this.state, {
            errorMessage: message
        });

        this.setState(newState);
    }

    private setLoginState(isLoggedIn: boolean) {
        const newState = Object.assign(this.state, {
            isLoggedIn: isLoggedIn
        });

        this.setState(newState);
    }

    private doLogin() {
        api('auth/administrator/login', 'post', {
            username: this.state.email,
            password: this.state.password
        }).then((res: ApiResponse) => {
            if (res.status === 'error') {
                this.setErrorMessage('System error, try again.');
                return;
            }

            if (res.status === 'ok') {
                if ( res.data.statusCode !== undefined) {
                    let message = '';
                    switch (res.data.statusCode) {
                        case -3001: message = 'Unknown username.'; break;
                        case -3002: message = 'Bad password.'; break;
                    }

                    this.setErrorMessage(message);

                    return;
                }

                saveToken(res.data.token);
                saveRefreshToken(res.data.refreshToken);

                this.setLoginState(true);

            }

        });
    }

    render() {
        if (this.state.isLoggedIn === true) {
            return (
                <Redirect to="/" />
            );
        }

        return (
            <Container>
                <Col md={ { span: 6, offset: 3 } } >
                    <Card>
                        <Card.Body>
                            <Card.Title>
                                <FontAwesomeIcon icon= { faSignInAlt } /> Administrator login
                            </Card.Title>
                                <Form>
                                    <Form.Group>
                                        <Form.Label htmlFor="email">Username: </Form.Label>
                                        <Form.Control type="emai" id="email"
                                        value={ this.state.email }
                                        onChange={ event => this.formInputChanged(event as any) } />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label htmlFor="password">Password: </Form.Label>
                                        <Form.Control type="password" id="password"
                                        value={ this.state.password }
                                        onChange={ event => this.formInputChanged(event as any) } />
                                    </Form.Group>
                                    <Form.Group>
                                        <Button variant="primary"
                                                onClick={ () => this.doLogin() }>
                                            Login
                                        </Button>
                                    </Form.Group>
                                </Form>
                                <Alert variant="danger"
                                        className={ this.state.errorMessage ? '' : 'd-none' }>
                                    { this.state.errorMessage }
                                </Alert>
                        </Card.Body>
                    </Card>
                </Col>
            </Container>
        );
    }
}