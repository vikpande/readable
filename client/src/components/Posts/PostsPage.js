import React, { Component } from 'react'
import {Navbar} from "../Navbar";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import PostList from "./PostList";
import * as postActions from "../../actions/posts";
import * as commentActions from "../../actions/comments";
import * as helpers from "../../utils/helpers";
import Modal from  'react-modal'


class PostsPage extends Component {
  constructor(props, context) {
    super(props, context);
    this.changeSortMethod = this.changeSortMethod.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      openModal: false,
      isEditing: false,
      newPost: {
        'title': '',
        'body': '',
        'category': 'react'
      }
    }
  }

  componentWillMount() {
    this.props.actions.loadPosts()
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      posts: nextProps.posts,
      sortBy: nextProps.sortBy,
      categories: nextProps.categories
    })
  }

  changeSortMethod (e) {
    let sortBy = e.target.value
    this.setState((prevState) => ({
      posts: helpers.sort(prevState.posts, sortBy),
      sortBy: sortBy
    }))
  }

  openModal = () => {
    this.setState({
      openModal: true
    })
  }

  closeModal = () => {
    this.setState({
      openModal: false
    })
  }

  handleChange(e) {
    let key = e.target.id
    let newPost = this.state.newPost
    newPost[key] = e.target.value
    this.setState({
      newPost: newPost
    })
  }

  createPost = (e) => {
    e.preventDefault()
    this.setState({
      openModal: false
    })

    let post = this.state.newPost;
    post['id'] = helpers.generateId()
    post['timestamp'] = Date.now()
    post['author'] = 'PassionInfinite'
    post['voteScore'] = 1
    this.props.actions.createPost(post)
    this.setState({
      newPost: {
        'title': '',
        'body': '',
        'category': ''
      }
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
                  <a href={"/"+category.path} style={{textDecoration:null}} key={category.path} className="margin-15">
                    <h1 className="badge badge-secondary" style={{fontSize: 16}}>{category.name}</h1>
                  </a>
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
            <div className="col-md-2 justify-content-center ml-md-auto">
              <button className="btn btn-dark margin-top-10" onClick={this.openModal}><i className="fa fa-plus"></i> Create Post</button>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <PostList posts={this.state.posts} />
            </div>
          </div>
        </div>


        <Modal isOpen={this.state.openModal} contentLabel="Create Modal">
          <i className="fa fa-close pull-right" onClick={this.closeModal}></i>
          <div className="row">
            <div className="col-md-12">
              <h4>Add New Post</h4>
              <form onSubmit={this.createPost}>
                <div className="form-group">
                  <label>Title</label>
                  <input type="text" className="form-control" id="title" placeholder="Enter title" value={this.state.newPost.title} onChange={this.handleChange} required={true}/>
                </div>
                <div className="form-group">
                  <label>Body</label>
                  <textarea className="form-control" id="body" placeholder="Content of your post"  onChange={this.handleChange} required={true}/>
                </div>
                <div className="form-check">
                  <label>Categories: </label>
                  <select className="form-control" id="category" defaultValue={this.state.newPost.category} onChange={this.handleChange} required={true}>
                    {this.props.categories.map(category => (
                      <option value={category.name} key={category.path}>{category.name}</option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="btn btn-primary">Create Post</button>
              </form>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    posts: helpers.sort(state.posts),
    sortBy: 'voteScore',
    categories: state.categories
  }
}

function mapDispatchToProps(dispatch) {
  let actions = { ...commentActions, ...postActions}
  return {actions: bindActionCreators(actions, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(PostsPage);
