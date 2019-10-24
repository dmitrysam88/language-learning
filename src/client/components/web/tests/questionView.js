import React, { Component } from 'react';
import _ from 'lodash';
import { translate } from '../../../lib/translater';

class QuestionView extends Component {

  render(){    
    let { question, onChengeQuestion, questionIndex, questionNumber, onCheckAnswer } = this.props;
    let lastQuestion = (questionIndex == questionNumber - 1);
    if(!question)
      return(null);
    return(
      <div>
        <div className="question-text-area">
          <p>{question.text}</p>
        </div>
        {
          question.type == "manyRight" && <p>{translate("you can choose many answers")}</p>
        }
        <div className="question-answer-area">
          <ul>
            { _.map(question.answers, (answer, index) =>
              <li key={index}>
                <div className="form-check">
                  <input onChange={(event) => this.props.onCheckAnswer(index, event.target.checked)} checked={answer.checked || false} type="checkbox"/>              
                  <span>{answer.text}</span>
                </div>
              </li>
            )}
          </ul>
        </div>
        <div className="question-button-area">
          <button onClick={() => this.props.onChengeQuestion(this.props.questionIndex - 1)} className="btn btn-secondary save-button">{translate('previous')}</button>
          {lastQuestion ? 
            <button onClick={() => this.props.onSendResults()} className="btn btn-secondary save-button">{translate('finish')}</button>
          :          
            <button onClick={() => this.props.onChengeQuestion(this.props.questionIndex + 1)} className="btn btn-secondary save-button">{translate('next')}</button> 
          }         
        </div>
      </div>
    );
  }
}

export default QuestionView;