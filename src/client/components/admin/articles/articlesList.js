import React, { Component } from 'react';
import { connect } from 'react-redux';
// import _ from 'lodash';

import { translate } from '../../../lib/translater';

import articlesModule from '../../../store/modules/article';
const articleActions = articlesModule.actions;

import ArticleForm from './articleForm';

class ArticlesList extends Component{

  constructor(props){
    super(props);
    props.getArticleNames();
    this.onOpenArticle = this.onOpenArticle.bind(this);
    this.onAddNewArticle = this.onAddNewArticle.bind(this);
    this.onDeleteArticle = this.onDeleteArticle.bind(this);
  }

  onOpenArticle(articleId){
    this.props.selectRemoteArticle(articleId);
  }

  onAddNewArticle(){
    this.props.selectArticle();
  }

  onDeleteArticle(articleId){
    if(confirm(translate('do you want to delete it'))){
      this.props.deleteArticle(articleId);
    }
  }

  render(){
    return(
      <div>
        <h3 className="ml-2">{translate('articles')}</h3>
        <div className="row">
            <div className="col-4">
              <button onClick={() => this.onAddNewArticle()} type="button" className="ml-2 btn btn-secondary">{translate('add new article')}</button>
              <ul>
                {this.props.articleNames.map((article) =>
                  <li key={article._id}>
                    <span>{article.name}</span>
                    <button onClick={() => this.onOpenArticle(article._id)} type="button" className="btn btn-link">{translate('open')}</button>
                    <button onClick={() => this.onDeleteArticle(article._id)} type="button" className="btn btn-link">{translate('delete')}</button>
                  </li>
                )}
              </ul>
            </div>
            <div className="col-8">
                <ArticleForm/>
            </div>
        </div>
      </div>
    );
  }

}

function mapStateToProps(state){
  return {
    articleNames: state.articles.articleNames || []
  }
}

export default connect(mapStateToProps, articleActions)(ArticlesList);