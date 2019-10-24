import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

class TestList extends Component{
  
  render(){
    return(
      <div>
        <ul>
          {_.map(this.props.testNames, (test)=>
            <li onClick={() => this.props.onSelectTest(test._id)} key={test._id} className="test-list-element">
              <p className="h3">{test.name || ""}</p>
              <p className="h5">{test.description || ""}</p>
            </li>
          )}
        </ul>
      </div>
    );
  }

}

export default TestList;