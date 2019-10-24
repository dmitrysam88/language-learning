import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from '../../../lib/translater';
import Select from 'react-select';
import _ from 'lodash';

import testModule from '../../../store/modules/test';
const testActions = testModule.actions;

import TestQuestion from './testQuestion';

class TestForm extends Component {

  constructor(props){
    super(props);
    this.onChangeData = this.onChangeData.bind(this);
    this.onSaveTest = this.onSaveTest.bind(this);
    this.onAddNewQuestion = this.onAddNewQuestion.bind(this);
    this.onAddNewAnswer = this.onAddNewAnswer.bind(this);
    this.onAnswerTextChange = this.onAnswerTextChange.bind(this);
    this.onAnswerrightChange = this.onAnswerrightChange.bind(this);
  }

  onChangeData(name, value){
    this.props.changeSelectedTestData(name, value);
  }

  onSaveTest(){
    if(this.props.selectedTest._id){
      this.props.saveTest(this.props.selectedTest);
    }else {
      this.props.addNewTest(this.props.selectedTest);
    }
  }

  onAddNewQuestion(){
    let questions = [];
    if(this.props.selectedTest.questions){
      questions = this.props.selectedTest.questions.slice();
    }
    questions.push({});
    this.onChangeData('questions', questions);
  }

  onAddNewAnswer(questionIndex){
    let question = Object.assign({}, this.props.selectedTest.questions[questionIndex]);
    let answers = question.answers || [];
    answers.push({});
    question.answers = answers;
    this.onChangeData(`questions[${questionIndex}]`, question);
  }

  onAnswerTextChange(questionIndex, answerIndex, value){
    this.onChangeData(`questions[${questionIndex}].answers[${answerIndex}].text`, value);
  }

  onAnswerrightChange(questionIndex, answerIndex, value){
    let question = _.get(this.props.selectedTest, `questions[${questionIndex}]`);
    if(question.type == 'oneRight'){
      let answers =_.map(question.answers, (answer, i) => {
        answer.right = answerIndex == i ? value : false
        return answer
      });
      this.onChangeData(`questions[${questionIndex}].answers`, answers);
    }else{
      this.onChangeData(`questions[${questionIndex}].answers[${answerIndex}].right`, value);
    }    
  }

  render(){    
    return(
      <div className="mt-2 mr-3">
        <div>
          <button onClick={this.onSaveTest} type="button" className="btn btn-secondary save-button">{translate('save')}</button>
        </div>
        <div>
          <div className="form-group">
            <label htmlFor="test-name">{translate('test name')}</label>
            <input onChange={(event) => this.onChangeData('name', event.target.value)} ref="testName" type="text" className="form-control mb-2" id="test-name" value={this.props.selectedTest.name || ""} placeholder={translate('test name')} />
            <label htmlFor="test-name">{translate('test description')}</label>
            <textarea rows="3" onChange={(event) => this.onChangeData('description', event.target.value)} ref="testDescription" type="text" className="form-control mb-2" id="test-description" value={this.props.selectedTest.description || ""} placeholder={translate('test description')} />
            <button onClick={() => this.onAddNewQuestion()} type="button" className="btn btn-secondary save-button mb-2">{translate('add question')}</button>
            <ul>
              {_.map(this.props.selectedTest.questions, (question, questionIndex) =>
                <TestQuestion 
                  key={questionIndex} 
                  questionIndex={questionIndex} 
                  question={question} 
                  onChangeData={this.onChangeData}
                  onAddNewAnswer={this.onAddNewAnswer}
                  onAnswerTextChange={this.onAnswerTextChange}
                  onAnswerrightChange={this.onAnswerrightChange}
                  questionTypes={[{ value: 'oneRight', label: translate('one right') }, { value: 'manyRight', label: translate('many right') }]}
                />
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
    selectedTest: state.test.selectedTest || {}
  }
}

export default connect(mapStateToProps, testActions)(TestForm);