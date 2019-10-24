import React, { Component } from 'react';
import _ from 'lodash';

class ArticleList extends Component {

  render(){
    return(
      <div>
        <ul>
          { _.map(this.props.articleNames, (article, index) =>
            <li onClick={() => this.props.onSelectArticle(article._id)} className="article-list-element" key={index}>
              <p className="h3">{article.name || ""}</p>
              <p className="h5">{article.description || ""}</p>
            </li>  
          )}
        </ul>
      </div>
    );
  }

}

export default ArticleList;