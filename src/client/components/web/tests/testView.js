import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import testModule from '../../../store/modules/test';
const testActions = testModule.actions;

import QuestionView from './questionView';
import { translate } from '../../../lib/translater';

class TestView extends Component {

  constructor(props){
    super(props);
    let pathname = _.get(props.history, 'location.pathname').split("/");
    props.getRemoteTest(pathname[pathname.length - 1]);
    this.onChengeQuestion = this.onChengeQuestion.bind(this);
    this.onCheckAnswer = this.onCheckAnswer.bind(this);
    this.onSendResults = this.onSendResults.bind(this);
    this.componentDidUpdate = this.componentDidUpdate.bind(this);
    this.state = {
      questionIndex: 0
    };
  }

  componentDidUpdate(prevProps){
    if(!prevProps.testFinished && this.props.testFinished){
      this.props.history.push('/web/tests');
      this.props.selectTest({});
    }
  }

  onChengeQuestion(newQuestionIndex){
    let questionNumber = _.get(this.props.selectedTest, 'questions.length') || 0;
    if(newQuestionIndex < 0)
      newQuestionIndex = 0;
    if(newQuestionIndex > questionNumber - 1)
      newQuestionIndex = questionNumber - 1
    this.setState({ questionIndex: newQuestionIndex });
  }

  onCheckAnswer(answerIndex, value){
    let question = _.get(this.props.selectedTest, `questions[${this.state.questionIndex}]`);
    if(!question)
      return;
    if(question.type == "oneRight" && value){
      let answers = _.map(question.answers, (answer, index) => {
        index == answerIndex ? answer.checked = value : answer.checked = false;
        return answer;
      });
      this.props.changeSelectedTestData(`questions[${this.state.questionIndex}].answers`, answers);
    }else {
      this.props.changeSelectedTestData(`questions[${this.state.questionIndex}].answers[${answerIndex}].checked`, value);
    }
  }
  
  onSendResults(){
    if(confirm(translate('do you want to finish test')))
      this.props.sendTestResults(this.props.selectedTest);
  }

  render(){
    return(
      <div>
        <div style={{ textAlign: "center" }}>
          <p className="h3">{_.get(this.props.selectedTest, "name") || ""}</p>
          <p className="h5">{_.get(this.props.selectedTest, "description") || ""}</p>
        </div>
          <QuestionView
            onCheckAnswer={this.onCheckAnswer}
            questionIndex={this.state.questionIndex} 
            question={_.get(this.props.selectedTest, `questions[${this.state.questionIndex}]`)}
            onChengeQuestion={this.onChengeQuestion}
            questionNumber={_.get(this.props.selectedTest, 'questions.length') || 0}
            onSendResults={this.onSendResults}
          />
      </div>
    );
  }

}

function mapStateToProps(state){
  return{
    selectedTest: state.test.selectedTest,
    testFinished: state.test.testFinished
  }
}

export default connect(mapStateToProps, testActions)(TestView);