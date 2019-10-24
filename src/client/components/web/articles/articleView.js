import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { translate } from '../../../lib/translater';
import moment from 'moment';

import ArticleComment from './articleComment';

import articlesModule from '../../../store/modules/article';
const articleActions = articlesModule.actions;

import { Route, Link, Redirect } from 'react-router-dom';

class ArticleView extends Component {

  constructor(props) {
    super(props);
    let pathname = _.get(props.history, 'location.pathname').split("/");
    props.selectRemoteArticle(pathname[pathname.length - 1]);
    this.onSendComment = this.onSendComment.bind(this);
    this.onEditComment = this.onEditComment.bind(this);
    this.onCancelEditComment = this.onCancelEditComment.bind(this);
    this.onDeleteComment = this.onDeleteComment.bind(this);
    this.onDeselectArticle = this.onDeselectArticle.bind(this);
    this.state = { 
      newCommentText: "",
      commentId: undefined
    };
  }

  onSendComment(){
    let articleId = this.props.selectedArticle._id;
    if(!articleId){
      return;
    }
    if(!this.state.commentId){
      this.props.addNewComment(articleId, { text: this.state.newCommentText, date: moment(), author: window.localStorage.getItem('userToken') });
    } else {
      let comment = Object.assign({}, _.find(this.props.selectedArticle.comments, { id: this.state.commentId }), { text: this.state.newCommentText });
      this.props.editComment(articleId, comment);
    }
    this.setState({ newCommentText: "", commentId: undefined });
  }

  onCancelEditComment(){
    this.setState({ newCommentText: "", commentId: undefined });
  }

  onEditComment(commentId, commentText){
    this.setState({ newCommentText: commentText, commentId: commentId });
  }

  onDeleteComment(commentId){
    if(this.props.selectedArticle._id && confirm(translate('do you want to delete it')))
      this.props.deleteComment(this.props.selectedArticle._id, commentId);
  }

  onDeselectArticle(){
    this.props.history.push('/web/articles');
    this.props.selectArticle()
  }

  render(){
    if(!this.props.selectedArticle)
      return null;
    return(
      <div>
        <div style={{ textAlign: 'end' }}>
          <button onClick={() => this.onDeselectArticle()} className="m-1 btn btn-secondary">{translate('back')}</button>
        </div>
        <div className="article-view">
          <p className="h3 article-title">{this.props.selectedArticle.name || ""}</p>
          <p>{this.props.selectedArticle.description || ""}</p>
          <div className="p-3 article-text">
            <p>{this.props.selectedArticle.text || ""}</p>
          </div>
          <div style={{ textAlign: 'end' }}>
            <span>{this.props.selectedArticle.date}</span>
          </div>
        </div>
        <div className="comments-arial">
          <div className="commnt-form">
            <div className="form-group">
              <label htmlFor="new-comment">{translate('write here your comment')}</label>
              <textarea onChange={(event) => this.setState({ newCommentText: event.target.value })} className="form-control" id="new-comment" rows="3" value={this.state.newCommentText}></textarea>
            </div>
            <div style={{ textAlign: 'end' }}>
            <button onClick={() => this.onCancelEditComment()} type="button" className="btn btn-secondary mr-2">{translate('cancel')}</button>
              <button onClick={() => this.onSendComment()} type="button" className="btn btn-secondary">{translate('send comment')}</button>
            </div>
          </div>
          <div>
            <ul>
              { _.map(this.props.selectedArticle.comments, (comment, index) => 
                <ArticleComment onEditComment={this.onEditComment} onDeleteComment={this.onDeleteComment} key={index} user={this.props.user} comment={comment} index={index}/>
              )}
            </ul>
          </div>
        </div>
      </div>
    );
  }

}
function mapStateToProps(state){
  return {
    selectedArticle: state.articles.selectedArticle,
    user: state.users.currentUser
  }
}

export default connect(mapStateToProps, articleActions)(ArticleView);