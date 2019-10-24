import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import articlesModule from '../../../store/modules/article';
const articleActions = articlesModule.actions;

import ArticleList from './articleList';
import ArticleView from './articleView';
import moment from 'moment';
import { translate } from '../../../lib/translater';
import { Route, Link, Redirect } from 'react-router-dom';

class IndexArticle extends Component {

  constructor(props) {
    super(props);
    props.getArticleNames();
    this.onSelectArticle = this.onSelectArticle.bind(this);
    this.componentDidUpdate = this.componentDidUpdate.bind(this);
    this.onDeleteComment = this.onDeleteComment.bind(this);
    moment.lang(props.localeName || 'en');
  }

  componentDidUpdate(prevProps) {
    if(prevProps.localeName != this.props.localeName){
      moment.lang(this.props.localeName || 'en');
    }
  }

  onSelectArticle(articleId) {
    if(!_.isEmpty(articleId)){
      this.props.history.push(`/web/articles/${articleId}`);
    }
  }

  onDeleteComment(commentId){
    if(this.props.selectedArticle._id && confirm(translate('do you want to delete it')))
      this.props.deleteComment(this.props.selectedArticle._id, commentId);
  }
  
  render(){
    return(
      <div className="row">
        <div className="col-12">
          <Route exact path="/web/articles" render={() => <ArticleList onSelectArticle={this.onSelectArticle} articleNames={this.props.articleNames}/>} />
          <Route path="/web/articles/:id" component={ArticleView}/>
          {/* { _.isEmpty(this.props.selectedArticle) ? 
            <ArticleList onSelectArticle={this.onSelectArticle} articleNames={this.props.articleNames}/>
            :
            <ArticleView />  
          } */}
        </div>        
      </div>
    );
  }
}

function mapStateToProps(state){
  return{
    localeName: state.locale.localeName,
    articleNames: state.articles.articleNames,
    selectedArticle: state.articles.selectedArticle,
    user: state.users.currentUser
  }
}

export default connect(mapStateToProps, articleActions)(IndexArticle);