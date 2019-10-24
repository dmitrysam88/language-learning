import React, { Component } from 'react';
import { translate } from '../../../lib/translater';

class Answer extends Component {
  render(){
    const { questionIndex, answerIndex, answer, questionType } = this.props;
    return(
      <li>
        <div className="answer-container">
          <div className="form-group answer-text">
            <label className="form-check-label" htmlFor={`text-answer-${questionIndex}-${answerIndex}`}>{`${translate('text answer')} ${answerIndex + 1}`}</label>
            <textarea onChange={(event) => this.props.onAnswerTextChange(questionIndex, answerIndex, event.target.value)} id={`text-answer-${questionIndex}-${answerIndex}`} className="form-control" value={answer.text || ""}></textarea>
          </div>
          <div className="form-group form-check answer-checkbox ml-1">
            <input onChange={(event) => this.props.onAnswerrightChange(questionIndex, answerIndex, event.target.checked)} type="checkbox" className="form-check-input" id={`right-answer-${questionIndex}-${answerIndex}`} checked={answer.right || false}/>
            <label className="form-check-label" htmlFor={`right-answer-${questionIndex}-${answerIndex}`}>{translate('right answer')}</label>
          </div>
        </div>
      </li>
    );
  }
}

export default Answer;