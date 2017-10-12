import React, { Component } from 'react'
import {Navbar} from "../Navbar";
// import {bindActionCreators} from "redux";
import * as actions from '../../actions/posts'
import {connect} from "react-redux";
import * as helpers from "../../utils/helpers";
import PostList from "../Posts/PostList";

class CategoryPage extends Component {
  constructor(props,context) {
    super(props, context)
    this.changeSortMethod = this.changeSortMethod.bind(this)
  }
  state = {
    sortBy: 'voteScore'
  }

  componentWillMount() {
    let category = this.props.match.params.category
    this.props.actions.loadCategoriesWisePosts(category)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      posts: nextProps.posts,
      categories: nextProps.categories,
      sortBy: nextProps.sortBy
    })
  }

  changeSortMethod (e) {
    let sortBy = e.target.value
    this.setState({
      posts: helpers.sort(this.props.posts, sortBy),
      sortBy: sortBy
    })
  }

  render() {
    return (
      <div className="container-fluid" style={{padding:0}}>
        <Navbar/>
        <div className="container">
          <div className="row margin-top-10">
            <div className="col-md-12">
              <label className="control-label">Categories</label>
              <div className="alert alert-info" role="alert">
                {this.props.categories.map(category => (
                  <a href={"/"+category.path} style={{textDecoration:null}} key={category.path} className="margin-15"><h1 className="badge badge-secondary" style={{fontSize: 16}}>{category.name}</h1></a>
                ))}
              </div>
            </div>
          </div>
          <div className="row margin-top-10">
            <div className="col-md-2">
              <label className="control-label">Order By:</label>
              <select className="form-control" value={this.state.sortBy} onChange={this.changeSortMethod}>
                <option value="voteScore">Vote Score</option>
                <option value="timestamp">TimeStamp</option>
              </select>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <PostList posts={this.state.posts} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    posts: state.posts,
    categories: state.categories
  }
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(actions, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoryPage);
