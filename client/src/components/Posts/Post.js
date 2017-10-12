import React from 'react'
import Comments from "../Comments";
import * as postActions from '../../actions/posts'
import * as commentActions from '../../actions/comments'
import * as helpers from "../../utils/helpers";
import * as categoryActions from "../../actions/categories";
import Vote from "../Vote";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import Modal from 'react-modal'
import {Redirect} from 'react-router'

class Post extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.deletePost = this.deletePost.bind(this);
    this.closeModal = this.closeModal.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  state = {
    editPost: {
      'title': '',
      'body': '',
      'category': ''
    },
    isEditing: false,
    categories: [],
    openModal: false
  }
  componentWillMount(){
    this.props.actions.loadCommentsById(this.props.post.id)
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.post) {
      this.setState(prevState => ({
        post: nextProps.post,
        showBody: nextProps.showBody,
        showComment: nextProps.showComment,
        comments: nextProps.comments,
        categories: nextProps.categories
      }))
    } else {
      this.setState({
        post: null,
        showBody: false,
        showComment: false,
        categories: nextProps.categories,
        comments: nextProps.comments
      })
    }
  }

  deletePost = (e) => {
    e.preventDefault()
    let postId = e.target.id
    this.props.actions.removePost(postId)
  }

  editPost = (e) => {
    e.preventDefault()
    let copyPost = this.props.post
    this.setState({
      editPost: copyPost,
      isEditing: true,
      openModal: true
    })
  }

  closeModal (e) {
    e.preventDefault()
    this.setState({
      openModal: false
    })
  }

  handleChange(e) {
    let key = e.target.id
    let editPost = this.state.editPost
    editPost[key] = e.target.value
    this.setState({
      editPost: editPost
    })
  }
  savePost = (e) => {
    e.preventDefault()
    this.props.actions.editPost(this.state.editPost)
    this.setState({
      editPost: {},
      openModal: false
    })
  }

  render() {
    if (this.props.post) {
      return (
        <div className="row">
          <div className="col-md-12">
            <div className="card margin-top-10" key={this.props.post.id}>
              <div className="card-body">
                <h4 className="card-title">
                  <div className="row">
                    <div className="col-md-6">
                      <a href={'/'+this.props.post.category+'/'+this.props.post.id}>{this.props.post.title}</a> <span className="text-muted" style={{fontSize: 16}}>{helpers.time(this.props.post.timestamp)}</span>
                    </div>
                    <div className="col-md-2 ml-md-auto">
                      <button className="btn btn-info btn-sm margin-15" id={this.props.post.id} onClick={this.editPost}><i className="fa fa-pencil"></i></button>
                      <button className="btn btn-danger btn-sm margin-15" id={this.props.post.id} onClick={this.deletePost}>Delete</button>
                    </div>
                  </div>
                </h4>
                <h6 className="card-subtitle mb-2 text-muted">By: {this.props.post.author}</h6>
                { this.props.showBody? <h4>{this.props.post.body}</h4> : ''}
                <div className="row">
                  <div className="col-md-2">
                    <p style={{fontSize:"16px", marginBottom:0 }}>votes: {this.props.post.voteScore}</p>
                    <Vote size={24} id={this.props.post.id} type={"post"} />
                  </div>
                </div>
                <div className="row margin-top-10">
                  <div className="col-md-12">
                    {this.props.comments[this.props.post.id] !== undefined ?
                      <h6>Comments: <span className="badge badge-success">{this.props.comments[this.props.post.id].length}</span></h6>
                      : 0}
                  </div>
                </div>
              </div>
              {this.props.comments && this.props.showComments ? <div className="card-footer">
                <Comments comments={this.props.comments[this.props.post.id]} post={this.props.post} />
              </div>: ""}
            </div>

            <Modal isOpen={this.state.openModal} contentLabel="Create Modal">
              <i className="fa fa-close pull-right" onClick={this.closeModal}></i>
              <div className="row">
                <div className="col-md-12">
                  <h4>Edit Post</h4>
                  <form onSubmit={this.savePost}>
                    <div className="form-group">
                      <label>Title</label>
                      <input type="text" className="form-control" id="title" placeholder="Enter title" onChange={this.handleChange} value={this.state.editPost.title} required={true}/>
                    </div>
                    <div className="form-group">
                      <label>Body</label>
                      <textarea className="form-control" id="body" placeholder="Content of your post"  onChange={this.handleChange} value={this.state.editPost.body} required={true}/>
                    </div>
                    <div className="form-check">
                      <label>Categories: </label>
                      <select className="form-control" id="category" value={this.state.editPost.category} onChange={this.handleChange} required={true}>
                        {this.props.categories.map(category => (
                          <option value={category.name} key={category.path}>{category.name}</option>
                        ))}
                      </select>
                    </div>
                    <button type="submit" className="btn btn-primary">Update Post</button>
                  </form>
                </div>
              </div>
            </Modal>
          </div>
        </div>
      )
    }
    return (
      <Redirect to={"/"} />
    )
  }
}


function mapStateToProps(state) {
  return {
    categories: state.categories,
    comments: state.comments
  }
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators({ ...postActions, ...commentActions, ...categoryActions }, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(Post);