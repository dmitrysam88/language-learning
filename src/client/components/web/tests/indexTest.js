import React, { Component } from 'react';
import { connect } from 'react-redux';

import testModule from '../../../store/modules/test';
const testActions = testModule.actions;
import { Route } from 'react-router-dom';

import TestList from './testList';
import TestView from './testView';

class IndexTest extends Component {

  constructor(props){
    super(props);
    props.getTestNames();
    this.onSelectTest = this.onSelectTest.bind(this);
  }

  onSelectTest(testId){
    this.props.history.push(`/web/tests/${testId}`);
  }

  render(){
    return(
      <div>
        <Route exact path="/web/tests" render={() => <TestList onSelectTest={this.onSelectTest} testNames={this.props.testNames}/>} />
        <Route path="/web/tests/:id" component={TestView}/>
      </div>
    );
  }
}

function mapStateToProps(state){
  return {
    testNames: state.test.testNames
  }
}

export default connect(mapStateToProps, testActions)(IndexTest);