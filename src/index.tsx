import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import HomePage from './components/HomePage/HomePage';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery/dist/jquery.js';
import 'popper.js/dist/popper.js';
import 'bootstrap/dist/js/bootstrap.min.js';
import '@fortawesome/fontawesome-free/css/fontawesome.min.css';
import { HashRouter, Switch, Route } from 'react-router-dom';
import ContactPage from './components/ContactPage/ContactPage';
import AdministratorLoginPage from './components/AdministratorLoginPage/AdministratorLoginPage';
import CategoryPage from './components/CategoryPage/CategoryPage';
import AdministratorDashboard from './components/AministratorDashboard/AdministratorDashboard';
import AdministratorDashboardCategory from './components/AdministratorDashboardCategory/AdministratorDashboardCategory';
import AdministratorDashboardArticle from './components/AdministratorDashboardArticle/AdministratorDashboardArticle';



ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <Switch>
        <Route exact path="/" component={ HomePage } />
        <Route path="/contact" component={ ContactPage } />
        <Route path="/administrator/login" component={ AdministratorLoginPage } />
        <Route path="/category/:categoryId" component={ CategoryPage} />
        <Route exact path="/administrator/dashboard" component={ AdministratorDashboard } />
        <Route path="/administrator/dashboard/category" component={ AdministratorDashboardCategory } />
        <Route path="/administrator/dashboard/article" component={ AdministratorDashboardArticle } />
      </Switch>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
