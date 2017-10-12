import _ from 'lodash'
import moment from 'moment'

export function sort(states, type='voteScore') {
  return _.orderBy(states, type, 'desc')
}

export function generateId() {
  return Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36);
}

export function time(timestamp) {
  return moment(timestamp).fromNow()
}

export function isEmpty(object) {
  return _.isEmpty(object)
}

export function getCommentsCount(comments, postId) {
  return comments.filter(comment => comment.parentId === postId).length
}