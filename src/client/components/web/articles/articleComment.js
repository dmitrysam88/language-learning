import React, { Component } from 'react';
import _ from 'lodash';
import moment from 'moment';
import { translate } from '../../../lib/translater';

class ArticleComment extends Component {

  constructor(props){
    super(props);
  }

  render(){
    const { comment } = this.props;
    return(
      <li>
        <div>
          <div className="comment-text">
            <span>{comment.text}</span>
            {_.get(this.props.user, '_id') == comment.authorId && 
              <span>
                <button onClick={() => this.props.onEditComment(comment.id, comment.text)} type="button" className="btn btn-link">{translate('edit')}</button>
                <button onClick={() => this.props.onDeleteComment(comment.id)} type="button" className="btn btn-link">{translate('delete')}</button>
              </span>
            }
          </div>
          <div className="comment-sign">
            <span>{comment.authorName}</span>
            <span>{moment(comment.date).format("Do MMMM YYYY HH:mm")}</span>
          </div>
        </div>
      </li>
    );
  }

}

export default ArticleComment;