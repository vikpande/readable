import React from 'react'
import {bindActionCreators} from "redux";
import * as postActions from '../actions/posts'
import * as commentActions from '../actions/comments'
import {connect} from "react-redux";
import * as helpers from "../utils/helpers";
import Vote from "./Vote";
import Modal from 'react-modal'

class Comments extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleChange = this.handleChange.bind(this)
    this.changeSortMethod = this.changeSortMethod.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }
  state = {
    sortBy: 'voteScore',
    editComment: {},
    openModal: false,
    isEditing: false
  }

  createComment = e => {
    e.preventDefault()
    let comment = {
      id: helpers.generateId(),
      body: e.target.comment.value,
      parentId: this.props.post.id,
      timestamp: Date.now(),
      author: 'PassionInfinite',
      voteScore: 1
    }
    this.props.actions.addNewComment(comment)
    e.target.comment.value = ""
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      comments: helpers.sort(nextProps.comments[0], this.state.sortBy),
      sortBy: this.state.sortBy
    })
  }

  changeSortMethod (e) {
    let sortBy = e.target.value
    this.setState({
      comments: helpers.sort(this.props.comments[0], sortBy),
      sortBy
    });
  }

  deleteComment  = e => {
    e.preventDefault()
    this.props.actions.removeComment(e.target.id)
  }

  handleChange(e) {
    let key = e.target.id
    let editComment = this.state.editComment
    editComment[key] = e.target.value
    this.setState({
      editPost: editComment
    })
  }

  editComment = e => {
    e.preventDefault()
    let commentId = e.target.id
    let comments = this.props.comments[0]
    let comment = comments.filter( currentComment => currentComment.id === commentId)
    this.setState({
      openModal:true,
      editComment: comment[0]
    })
  }

  saveComment = (e) => {
    e.preventDefault()
    this.props.actions.editComment(this.state.editComment)
    this.setState({
      openModal: false,
      newComment: {}
    })
  }

  closeModal (e) {
    e.preventDefault()
    this.setState({
      openModal: false
    })
  }

  render () {
    return (
      <div className="row">
        <div className="col-md-12">
          <div className="row">
            <div className="col-md-2">
              <label className="control-label"><b>Comments:</b></label>
            </div>
            <div className="col-md-4 ml-md-auto">
              <label className="control-label">Order By:</label>
              <select className="form-control sort-by-selection" value={this.state.sortBy} onChange={this.changeSortMethod}>
                <option value="voteScore">Vote Score</option>
                <option value="timestamp">TimeStamp</option>
              </select>
            </div>
          </div>
          <div className="row margin-top-10">
            <div className="col-md-12">
              {this.state.comments ? this.state.comments.map(comment => (
                <div className="" key={comment.id}>
                  <h6 style={{marginBottom: 4}} className="margin-top-10"><b>{comment.author}:</b>
                    <span className="text-muted">{helpers.time(comment.timestamp)}</span> &nbsp;
                    <span><i className="fa fa-pencil-square text-info" id={comment.id} onClick={this.editComment}></i></span> &nbsp;
                    <span><i onClick={this.deleteComment.bind(this)} id={comment.id} className="fa fa-minus-square text-danger"></i></span> &nbsp;
                  </h6>
                  <span className="text-muted">{comment.body}</span>
                  <p style={{marginBottom:0}}>votes: {comment.voteScore}</p>
                  <Vote size={20} id={comment.id} type={"comment"} />
                </div>
              )) : []}
              <form onSubmit={this.createComment} className="margin-top-10">
                <div className="row">
                  <div className="col-md-6">
                    <input type="text" required name="comment" placeholder="Enter your comment" className="form-control"/>
                  </div>
                  <div className="col-md-6">
                    <button className="btn btn-dark btn-md" type="submit">Comment</button>
                  </div>
                </div>
              </form>

              <Modal isOpen={this.state.openModal} contentLabel="Create Modal">
                <i className="fa fa-close pull-right" onClick={this.closeModal}></i>
                <div className="row">
                  <div className="col-md-12">
                    <h4>Edit Post</h4>
                    <form onSubmit={this.saveComment}>
                      <div className="form-group">
                        <label>Body</label>
                        <textarea className="form-control" id="body" placeholder="Content of your comment"  onChange={this.handleChange} value={this.state.editComment.body} required={true}/>
                      </div>
                     <button type="submit" className="btn btn-primary">Update Comment</button>
                    </form>
                  </div>
                </div>
              </Modal>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps({comments}) {
  return {comments: helpers.sort(comments)}
}
function mapDispatchToProps(dispatch) {
  let actions = {...postActions, ...commentActions};
  return {actions: bindActionCreators(actions, dispatch)}
}

export default connect(mapStateToProps,mapDispatchToProps)(Comments)