import React from 'react';
import { Container, Card, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { faListAlt, faPlus, faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Redirect } from 'react-router-dom';
import api, { ApiResponse } from '../../api/api';
import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';
import ArticleType from '../../types/ArticleType';
import ApiArticleDto from '../../dtos/ApiArticleDto';
import CategoryType from '../../types/CategoryType';
import ApiCategoryDto from '../../dtos/ApiCategoryDto';

interface AdministratorDashboardArticleState {
  isAdministratorLoggedIn: boolean;
  articles: ArticleType[];
  categories: CategoryType[];
  
  addModal:{
      visible: boolean;
      name: string;
      categoryId: number;
      imagePath: string;
      description: string;
      ingredients: string;
      price: number;
      message: string;
  };
  editModal: {
    articleId?: number;
    visible: boolean;
    name: string;
    categoryId: number;
    imagePath: string;
    description: string;
    ingredients: string;
    price: number;
    message: string;
};
}


class AdministratorDashboardArticle extends React.Component {
  state: AdministratorDashboardArticleState;

  constructor(props: Readonly<{}>) {
    super(props);

    this.state = {
      isAdministratorLoggedIn: true,
      articles: [],
      categories: [],
      addModal: {
          visible: false,
          name: '',
          categoryId: 1,
          imagePath: '',
          description: '',
          ingredients: '',
          price: 1,
          message: ''
      },
      editModal: {
        visible: false,
        name: '',
        categoryId: 1,
        imagePath: '',
        description: '',
        ingredients: '',
        price: 1,
        message: ''
    }

    };
  }

  private getCategories() {
    api('api/category/', 'get', {})
    .then((res: ApiResponse) => {
        if (res.status === "error"){
            this.setLogginState(false);
            return;
        }

        this.putCategoriesInState(res.data);
    });
  }

  private putCategoriesInState(data: ApiCategoryDto[]) {
    const categories: CategoryType[] = data.map(category => {
      return {
        categoryId: category.categoryId,
        name: category.name,
        imagePath: category.imagePath,
        description: category.description,
        measurement: category.measurement
      };
    });

    this.setState(Object.assign(this.state, {
      categories: categories,
    }));
    
  }

  

  private setAddModalVisibleState(newState: boolean) {
    this.setState(Object.assign(this.state,
        Object.assign(this.state.addModal, {
            visible: newState
        })
    ));
  }

  private setAddModalStringFieldState(fieldName: string, newValue: string) {
    this.setState(Object.assign(this.state,
        Object.assign(this.state.addModal, {
            [ fieldName ]: newValue
        })
    ));
  }

  private setAddModalNumberFieldState(fieldName: number, newValue: any) {
    this.setState(Object.assign(this.state,
        Object.assign(this.state.addModal, {
            [ fieldName ]: (newValue === 'nul') ? null : Number(newValue)
    })
));
}

  private setEditModalVisibleState(newState: boolean) {
    this.setState(Object.assign(this.state,
        Object.assign(this.state.editModal, {
            visible: newState
        })
    ));
  }

  private setEditModalStringFieldState(fieldName: string, newValue: string) {
    this.setState(Object.assign(this.state,
        Object.assign(this.state.editModal, {
            [ fieldName ]: newValue
        })
    ));
  }

    private setEditModalNumberFieldState(fieldName: string, newValue: any) {
        this.setState(Object.assign(this.state,
            Object.assign(this.state.addModal, {
                [ fieldName ]: (newValue === 'nul') ? null : Number(newValue)
        })
    ));
  }
  componentDidMount() {
    this.getCategories();
    this.getArticles();
  }

  private getArticles() {
    api('api/article/?join=category&join-photos', 'get', {})
    .then((res: ApiResponse) => {
        if (res.status === "error"){
            this.setLogginState(false);
            return;
        }

        this.putArticlesInState(res.data);
    });
  }

  private putArticlesInState(data: ApiArticleDto[]) {
    const articles: ArticleType[] = data.map(article => {
      return {
        articleId: article.articleId,
        name: article.name,
        imagePath: article.photos?.imagePath,
        description: article.description,
        ingredients: article.ingredients,
        price: article.price,
        photos: article.photos,
        category: article.category
      };
    });

    this.setState(Object.assign(this.state, {
        articles: articles
    }));
  }

  private setLogginState(isLoggedIn: boolean) {
      this.setState(Object.assign(this.state, {
          isAdministratorLoggedIn: isLoggedIn
      }));
  }

  render() {
      if (this.state.isAdministratorLoggedIn === false) {
          return (
              <Redirect to="/administrator/login" />
          );
      }
    return (
      <Container>
        <RoledMainMenu role='administrator' />
                <Card>
                    <Card.Body>
                        <Card.Title>
                            <FontAwesomeIcon icon= { faListAlt } /> Articles
                        </Card.Title>
                        
                        <Table hover size="sm" bordered>
                            <thead>
                                <tr>
                                    <th colSpan={ 5 }></th>
                                    <th className="text-center">
                                        <Button variant="primary" size="sm" onClick={ () => this.showAddModal() }> 
                                            <FontAwesomeIcon icon={ faPlus } /> Add
                                        </Button>
                                    </th>
                                </tr>
                                <tr>
                                    <th className="text-right">ID</th>
                                    <th>Name</th>
                                    <th>Category</th>
                                    <th>Description</th>
                                    <th className="text-right">Price</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                { this.state.articles.map(article => (
                                    <tr>
                                        <td className="text-right">{ article.articleId }</td>
                                        <td>{ article.name }</td>
                                        <td>{ article.category?.name }</td>
                                        <td>{ article.description }</td>
                                        <td className="text-right">{ article.price } RSD</td>
                                        <td className="text-center">
                                            <Button variant="info" size="sm" onClick= { () => this.showEditModal(article) }>
                                                <FontAwesomeIcon icon={ faEdit } /> Edit
                                            </Button>
                                        </td>
                                    </tr>
                                ), this) }
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
                <Modal size="lg" centered show={ this.state.addModal.visible } onHide={ () => this.setAddModalVisibleState(false) } >
                    <Modal.Header closeButton>
                        <Modal.Title> Add new article</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label htmlFor="name">Name</Form.Label>
                            <Form.Control id="name" type="text" value={ this.state.addModal.name }
                            onChange={ (e) => this.setAddModalStringFieldState('name', e.target.value) } />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="categoryId">Category</Form.Label>
                            <Form.Control id="categoryId" type="number" value={ this.state.addModal.categoryId }
                            onChange={ (e) => this.setAddModalStringFieldState('categoryId', e.target.value) } >
                                { this.state.categories.map(category => (
                                    <option value={ category.categoryId?.toString() } >
                                            { category.name }
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="imagePath">Image URL</Form.Label>
                            <Form.Control id="imagePath" type="url" value={ this.state.addModal.imagePath }
                            onChange={ (e) => this.setAddModalStringFieldState('imagePath', e.target.value) } />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="description">Description</Form.Label>
                            <Form.Control id="description" as="textarea" value={ this.state.addModal.description }
                            onChange={ (e) => this.setAddModalStringFieldState('description', e.target.value) } rows={ 10 } />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="ingredients">Ingredients</Form.Label>
                            <Form.Control id="ingredients" as="textarea" value={ this.state.addModal.ingredients }
                            onChange={ (e) => this.setAddModalStringFieldState('ingredients', e.target.value) } rows={ 10 } />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="price">Price</Form.Label>
                            <Form.Control id="price" type="number" value={ this.state.addModal.price }
                            onChange={ (e) => this.setAddModalNumberFieldState(Number('price'), e.target.value) } />
                        </Form.Group>
                        <Form.Group>
                            <Button variant="primary" onClick={ () => this.doAddArticle() }>
                                <FontAwesomeIcon icon={ faPlus } /> Add new article
                            </Button>
                        </Form.Group>
                        { this.state.addModal.message ? (
                            <Alert variant="danger" value={ this.state.addModal.message } />
                        ) : '' }
                    </Modal.Body>
                </Modal>

                <Modal size="lg" centered show={ this.state.editModal.visible } onHide={ () => this.setEditModalVisibleState(false) } >
                    <Modal.Header closeButton>
                        <Modal.Title> Edit article</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label htmlFor="name">Name</Form.Label>
                            <Form.Control id="name" type="text" value={ this.state.editModal.name }
                            onChange={ (e) => this.setEditModalStringFieldState('name', e.target.value) } />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="categoryId">Category</Form.Label>
                            <Form.Control id="category" type="number" value={ this.state.addModal.categoryId }
                            onChange={ (e) => this.setAddModalStringFieldState('categoryId', e.target.value) } >
                                { this.state.categories.map(category => (
                                    <option value={ category.categoryId?.toString() } >
                                            { category.name }
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="imagePath">Image URL</Form.Label>
                            <Form.Control id="imagePath" type="url" value={ this.state.editModal.imagePath }
                            onChange={ (e) => this.setEditModalStringFieldState('imagePath', e.target.value) } />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="description">Description</Form.Label>
                            <Form.Control id="description" as="textarea" value={ this.state.editModal.description }
                            onChange={ (e) => this.setEditModalStringFieldState('description', e.target.value) } rows={ 10 } />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="ingredients">Ingredients</Form.Label>
                            <Form.Control id="ingredients" as="textarea" value={ this.state.editModal.ingredients }
                            onChange={ (e) => this.setEditModalStringFieldState('ingredients', e.target.value) } rows={ 10 } />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="price">Price</Form.Label>
                            <Form.Control id="price" type="number" value={ this.state.editModal.price }
                            onChange={ (e) => this.setEditModalNumberFieldState('price', e.target.value) } />
                        </Form.Group>
                        <Form.Group>
                            <Button variant="primary" onClick={ () => this.doEditArticle() }>
                                <FontAwesomeIcon icon={ faEdit } /> Edit Article
                            </Button>
                        </Form.Group>
                        { this.state.editModal.message ? (
                            <Alert variant="danger" value={ this.state.editModal.message } />
                        ) : '' }
                    </Modal.Body>
                </Modal>
            </Container>
    );
  }

  private showAddModal() {
    this.setAddModalStringFieldState('name', '');
    this.setEditModalStringFieldState('category', '');
    this.setAddModalStringFieldState('imagePath', '');
    this.setAddModalStringFieldState('description', '');
    this.setAddModalStringFieldState('ingredients', '');
    this.setEditModalStringFieldState('price', '');
    this.setAddModalStringFieldState('message', '');
    this.setAddModalVisibleState(true);
  }

  private doAddArticle() {
    api('api/article/', 'post', {
        name: this.state.addModal.name,
        categoryId: this.state.addModal.categoryId,
        imagePath: this.state.addModal.imagePath,
        description: this.state.addModal.description,
        ingredients: this.state.addModal.ingredients,
        price: this.state.addModal.price
    })
    .then((res: ApiResponse) =>{
        if (res.status === "error"){
            this.setAddModalStringFieldState('message', JSON.stringify(res.data));
            return;
        }

        this.setAddModalVisibleState(false);
        this.getArticles();
    });
  }

  private showEditModal(article: ArticleType) {
    this.setEditModalStringFieldState('name', String(article.name));
    this.setEditModalStringFieldState('category', String(article.categoryId));
    this.setEditModalStringFieldState('imagePath', String(article.imagePath));
    this.setEditModalStringFieldState('description', String(article.description));
    this.setEditModalStringFieldState('ingredients', String(article.ingredients));
    this.setEditModalStringFieldState('price', String(article.price));
    this.setEditModalStringFieldState('message', '');
    this.setEditModalVisibleState(true);
  }

  private doEditArticle() {
    api('api/article/' + Number(this.state.editModal.articleId) + '/', 'patch', {
        name: this.state.editModal.name,
        categoryId: this.state.editModal.categoryId,
        imagePath: this.state.editModal.imagePath,
        description: this.state.editModal.description,
        ingredients: this.state.editModal.ingredients,
        price: this.state.editModal.price
    })
    .then((res: ApiResponse) =>{
        if (res.status === "error"){
            this.setEditModalStringFieldState('message', JSON.stringify(res.data));
            return;
        }

        this.setEditModalVisibleState(false);
        this.getArticles();
    });
  }

}

export default AdministratorDashboardArticle;
