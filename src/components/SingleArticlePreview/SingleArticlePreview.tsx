import React from "react";
import { Col, Card, Form, Button, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import ArticleType from "../../types/ArticleType";
import { ApiConfig } from "../../config/api.config";
import api, { ApiResponse } from "../../api/api";

interface SingleArticlePreviewProperties {
    article: ArticleType
}

interface SingleArticlePreviewState {
    quantity: number;
}

export default class SingleArticlePreview extends React.Component<SingleArticlePreviewProperties> {
    state: SingleArticlePreviewState;
    
    constructor(props: Readonly<SingleArticlePreviewProperties>) {
        super(props);

        this.state = {
            quantity: 1
        }
    }

    private quantityChanged(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            quantity: Number(event.target.value)
        });
    }

    private addToCart() {
        const data = {
            articleId: this.props.article.articleId,
            quantity: this.state.quantity
        };

        api('/cart/addToCart', 'post', data)
            .then((res: ApiResponse) => {
                if (res.status === 'error'){
                    return;
                }

                window.dispatchEvent(new CustomEvent('cart.update'));
                
            });
    }

    render(){
        return(
            <Col lg="3" md="4" sm="6" xs="12">
                <Card className="mb-3">
                    <Card.Header>
                        <img alt={ this.props.article.name }
                             src={ ApiConfig.PHOTO_PATH + 'small/' + this.props.article.imagePath }
                             className="w-100" />
                    </Card.Header>
                    <Card.Body>
                        <Card.Title as="p">
                            <strong>{ this.props.article.name }</strong>
                        </Card.Title>
                        <Card.Text>
                           Price: { Number(this.props.article.price) } RSD
                        </Card.Text>
                        <Form.Group>
                            <Row>
                                <Col xs="7">
                                    <Form.Control type="number" min="1" step="1" value={ this.state.quantity } 
                                                  onChange={ (e) => this.quantityChanged(e as any) }/>
                                </Col>
                                <Col xs="5">
                                    <Button variant="secondary"
                                            onClick={ () => this.addToCart() }>
                                        Buy
                                    </Button>
                                </Col>
                            </Row>
                        </Form.Group>
                        <Link to={ `/article/${ this.props.article.articleId }` }
                              className="btn btn-primary btn-block btn-sm">
                            Open article page
                        </Link>
                    </Card.Body>
                </Card>
            </Col>
        );
    }
}