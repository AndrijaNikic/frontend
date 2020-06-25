import React from "react";
import { Container, Card, Row, Col, Form, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListAlt, faCheck } from "@fortawesome/free-solid-svg-icons";
import CategoryType from "../../types/CategoryType";
import ArticleType from "../../types/ArticleType";
import api, { ApiResponse } from "../../api/api";
import SingleArticlePreview from "../SingleArticlePreview/SingleArticlePreview";
import RoledMainMenu from "../RoledMainMenu/RoledMainMenu";

interface CategoryPageProperties {
    match: {
        params: {
            categoryId: number;
        }
    }
}

interface CategoryPageState {
    category?: CategoryType;
    articles?: ArticleType[];
    message: string;
    filters: {
        order: "price asc" | "price desc";
    };
}

interface CategoryDto {
    categoryId: number;
    name: string;
    description: string;
    // imagePath?: string;
}

interface ArticleDto {
    articleId: number;
    name: string;
    description?: string;
    imagePath?: string;
    ingredients?: string;
    price?: number;
    photos?: {
        imagePath: string;
    }
}

export default class CategoryPage extends React.Component<CategoryPageProperties> {
    state: CategoryPageState;
    
    constructor(props: Readonly<CategoryPageProperties>) {
        super(props);

        this.state = {
            message: '',
            filters: {
                order: "price asc"
            }
         };

    }

    private setMessage(message: string) {
        const newState = Object.assign(this.state, {
            message: message
        });

        this.setState(newState);
    }

    private setCategoryData(category: CategoryType) {
        this.setState(Object.assign(this.state, {
            category: category
        }));
    }

    private setArticles(articles: ArticleType[]) {
        this.setState(Object.assign(this.state, {
            articles: articles
        }));
    }

    render() {
        return(
            <Container>
                <RoledMainMenu role='visitor' />
                <Card>
                    <Card.Body>
                        <Card.Title>
                            <FontAwesomeIcon icon= { faListAlt } /> { this.state.category?.name }
                        </Card.Title>
                        { this.printOptionalMessage() }

                        <Row>
                            <Col xs="12" md="4" lg="3">
                                {this.printFilters()}
                            </Col>

                            <Col xs="12" md="8" lg="9">
                                { this.showArticles() }
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Container>
        );
    }

    private setNewFilter(newFilter: any) {
        this.setState(Object.assign(this.state, {
            filter: newFilter
        }));
    }

    private filterChanged(event: React.ChangeEvent<HTMLSelectElement>){
        this.setNewFilter(Object.assign(this.state.filters, {
            order: event.target.value
        }));
    }

    private applyFilter(){
        this.getCategoryData();
    }

    private printFilters(){
        return(
            <>
                <Form.Group>
                    <Form.Control as="select" id="sortOrder" 
                                  value ={ this.state.filters.order }
                                  onChange={ (e) => this.filterChanged(e as any) }>
                        <option value="price asc">Sort by price - ascending</option>
                        <option value="price desc">Sort by price - descending</option>
                    </Form.Control>
                </Form.Group>
                <Form.Group>
                    <Button variant="primary" block onClick={ () => this.applyFilter() }>
                        <FontAwesomeIcon icon={ faCheck } /> Confirm
                    </Button>
                </Form.Group>
            </>
        );
    }

    private printOptionalMessage() {
        if (this.state.message === ''){
            return;
        }
        return (
            <Card.Text>
                { this.state.message }
            </Card.Text>
        );
    }

    private showArticles() {
        if (this.state.articles?.length === 0) {
            return(
                <div>There are no articles to show.</div>
            );
        }

        return (
            <Row>
                { this.state.articles?.map(this.singleArticle) }
            </Row>
        );

    }

    private singleArticle(article: ArticleType) {
        return(
            <SingleArticlePreview article={ article } />
        );
    }

    

    componentDidMount() {
        this.getCategoryData();
    }

    componentDidUpdate(oldProperties: CategoryPageProperties) {
        if (oldProperties.match.params.categoryId === this.props.match.params.categoryId) {
            return;
        }

        this.getCategoryData();
    }

    private getCategoryData() {
        api('api/category/' + this.props.match.params.categoryId, 'get', {})
        .then((res:ApiResponse) => {
            if (res.status === 'error') {
                return this.setMessage('Request error, please refresh.');
            }

            const categoryData: CategoryType = {
                categoryId: res.data.categoryId,
                name: res.data.name,
                // imagePath: res.data.categoryPhotos.imagePath,
                description: res.data.description
            };

            this.setCategoryData(categoryData);


        });

        const orderParts = this.state.filters.order.split(' ');
        // const orderBy = orderParts[0];
        const orderDirection = orderParts[1].toUpperCase();

        api('api/article/filter/', 'post', {
            categoryId: Number(this.props.match.params.categoryId),
            orderBy: 'article.price',
            orderDirection: orderDirection
        })
        .then((res: ApiResponse) => {
            if (res.status === 'error') {
                return this.setMessage('Request error, please refresh.');
            }

            if(res.data.statusCode === 0) {
                this.setMessage('');
                this.setArticles([]);
                return;
            }

            const articles: ArticleType[] =
            res.data.map((article: ArticleDto) => {

                const object: ArticleType = {
                articleId: article.articleId,
                name: article.name,
                description: article.description,
                imagePath: article.photos?.imagePath,
                ingredients: article.ingredients,
                price: article.price,
                };

                // if (article.photos !== undefined) {
                //     object.imagePath = article.photos.imagePath
                // }

                return object;
            });

            this.setArticles(articles);
        });
    }
}