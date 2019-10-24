import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from '../../../lib/translater';

import testModule from '../../../store/modules/test';
const testActions = testModule.actions;

import TestForm from './testForm';

class TestList extends Component {

  constructor(props){
    super(props);
    props.getTestNames();
    this.onOpenTest = this.onOpenTest.bind(this);
    this.onDeleteTest = this.onDeleteTest.bind(this);
    this.onAddNewTest = this.onAddNewTest.bind(this);
  }

  onOpenTest(testId){
    this.props.getRemoteTest(testId);
  }

  onDeleteTest(testId){
    if(confirm(translate('do you want to delete it'))){
      this.props.deleteTest(testId);
    }
  }

  onAddNewTest(){
    this.props.selectTest({});
  }

  render(){
    return(
      <div>
        <div className="row">
          <div className="col-3">
            <p className="ml-2">{translate('test list')}</p>
            <div>
              <button onClick={() => this.onAddNewTest()} type="button" className="ml-2 btn btn-secondary">{translate('add new')}</button>
            </div>
            <ul>
              {this.props.testNames.map((test) => 
                <li key={test._id}>
                  <span>{test.name}</span>
                  <button onClick={() => this.onOpenTest(test._id)} type="button" className="btn btn-link">{translate('open')}</button>
                  <button onClick={() => this.onDeleteTest(test._id)} type="button" className="btn btn-link">{translate('delete')}</button>
                </li>
              )}
            </ul>
          </div>
          <div className="col-9">
            <TestForm />
          </div>
        </div>
      </div>
    );
  }

}

function mapStateToProps(state){
  return {
    testNames: state.test.testNames || []
  };
}

export default connect(mapStateToProps, testActions)(TestList);