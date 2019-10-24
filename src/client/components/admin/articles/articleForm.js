import React, { Component } from 'react';
import { connect } from 'react-redux';

import { translate } from '../../../lib/translater';
import moment from 'moment';

import articlesModule from '../../../store/modules/article';
const articleActions = articlesModule.actions;

import _ from 'lodash';

class ArticleForm extends Component{

  constructor(props){
    super(props);
    this.onSaveArticle = this.onSaveArticle.bind(this);
    this.onChangeArticleData = this.onChangeArticleData.bind(this);
    this.addAutorDataToNewArticle = this.addAutorDataToNewArticle.bind(this);
    this.getArticleDate = this.getArticleDate.bind(this);
  }

  onChangeArticleData(name, value){
    this.props.changeArticleData(name, value);
  }

  addAutorDataToNewArticle(article){
    article.author = "John Doe";
    article.date = moment();
    return article;
  }

  onSaveArticle(){
    let { selectedArticle } = this.props;
    if (!selectedArticle._id){
      this.props.addNewArticle(this.addAutorDataToNewArticle(selectedArticle));
    }else{
      this.props.saveArticle(selectedArticle);
    }
  }

  getArticleDate(){
    if(!_.isEmpty(this.props.selectedArticle.date)){
      return moment(this.props.selectedArticle.date).format('DD.MM.YYYY HH:mm');
    } else {
      return "";
    }
  }

  render(){
    return(
      <div className="mr-3">
        <p>{translate('article form')}</p>
        <div>
          <button onClick={this.onSaveArticle} type="button" className="btn btn-secondary save-button">{translate('save')}</button>
        </div>
        <label>{translate('name')}</label>
        <input onChange={(event) => this.onChangeArticleData('name', event.target.value)} type="text" className="form-control" value={this.props.selectedArticle.name || ""}/>
        <label>{translate('description')}</label>
        <textarea onChange={(event) => this.onChangeArticleData('description', event.target.value)} rows="3" className="form-control" value={this.props.selectedArticle.description || ""}/>
        <label>{translate('text')}</label>
        <textarea onChange={(event) => this.onChangeArticleData('text', event.target.value)} rows="15" className="form-control" value={this.props.selectedArticle.text || ""}/>
        {!_.isEmpty(this.props.selectedArticle.date) &&
        <div>
          <label className="mr-2">{translate('date')}</label>
          <span>{this.getArticleDate()}</span>
        </div>
        }
        {!_.isEmpty(this.props.selectedArticle.author) && 
          <div>
            <label className="mr-2">{translate('author')}</label>
            <span>{this.props.selectedArticle.author}</span>
          </div>
        }        
      </div>
    );
  }

}

function mapStateToProps(state){
  return {
    selectedArticle: state.articles.selectedArticle || {}
  }
}

export default connect(mapStateToProps, articleActions)(ArticleForm);