import React, { Component } from 'react';
import { translate } from '../../../lib/translater';
import _ from 'lodash';
import Select from 'react-select';

import Answer from './answer';

class TestQuestion extends Component {

  render(){
    const { question, questionIndex, questionTypes } = this.props;
    let selectedQuestonType = _.find(questionTypes, { value: question.type });
    return(
      <li>
        <label htmlFor={`text-questio-${questionIndex}`}>{`${translate('text question')} ${questionIndex + 1}`}</label>
        <textarea onChange={(event) => this.props.onChangeData(`questions[${questionIndex}].text`, event.target.value)} id={`text-questio-${questionIndex}`} className="form-control" value={question.text || ""}></textarea>
        <input onChange={(event) => this.props.onChangeData(`questions[${questionIndex}].price`, event.target.value)} className="form-control mt-1 mb-2" type="number" value={question.price || ""}/>
        <Select onChange={(value) => this.props.onChangeData(`questions[${questionIndex}].type`, value.value)} value={selectedQuestonType} options={questionTypes}/>
        <button onClick={() => this.props.onAddNewAnswer(questionIndex)} type="button" className="btn btn-secondary save-button mb-2">{translate('add answer')}</button>
        <ul>
          {_.map(question.answers, (answer, answerIndex) =>
            <Answer 
              key={`${questionIndex}-${answerIndex}`}
              questionIndex={questionIndex}
              answerIndex={answerIndex}
              answer={answer}
              onAnswerTextChange={this.props.onAnswerTextChange}
              onAnswerrightChange={this.props.onAnswerrightChange}
              questionType={question.type}
            />
          )}
        </ul>
      </li>
    );
  }

}

export default TestQuestion;