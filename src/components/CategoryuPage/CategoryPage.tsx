import React from "react";
import { Container, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListAlt } from "@fortawesome/free-solid-svg-icons";
import CategoryType from "../../types/CategoryType";

interface CategoryPageProperties {
    match: {
        params: {
            categoryId: number;
        }
    }
}

interface CategoryPageState {
    category?: CategoryType;
}

export default class CategoryPage extends React.Component<CategoryPageProperties> {
    state: CategoryPageState;
    
    constructor(props: Readonly<CategoryPageProperties>) {
        super(props);

        this.state = { };

    }

    render() {
        return(
            <Container>
                <Card>
                    <Card.Body>
                        <Card.Title>
                            <FontAwesomeIcon icon= { faListAlt } /> { this.state.category?.name }
                        </Card.Title>
                        <Card.Text>
                            Articles shown here.
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Container>
        );
    }

    componentWillMount() {
        this.getCategoryData();
    }

    componentWillReceiveProps(newProperties: CategoryPageProperties) {
        if (newProperties.match.params.categoryId === this.props.match.params.categoryId) {
            return;
        }

        this.getCategoryData();
    }

    private getCategoryData() {
        setTimeout(() => {
            const data: CategoryType = {
                name: 'Category: ' + this.props.match.params.categoryId,
                categoryId: this.props.match.params.categoryId,
                items: []
            };

            this.setState({
                category: data
            });
        }, 400);
    }
}