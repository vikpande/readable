import React from 'react';
import {Route, Switch} from 'react-router';
import PostsPage from './components/Posts/PostsPage';
import PostPage from "./components/Posts/PostPage";
import CategoryPage from "./components/Category/CategoryPage";

export default (
  <div>
    <Switch>
      <Route exact path = "/" component = {PostsPage}/>
      <Route exact path="/:category" component = {CategoryPage} />
      <Route exact path="/:category/:id" component = {PostPage} />
    </Switch>
  </div>
);