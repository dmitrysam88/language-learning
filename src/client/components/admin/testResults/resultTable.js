import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from '../../../lib/translater';
import _ from 'lodash';
import moment from 'moment';

import testModule from '../../../store/modules/test';
const testActions = testModule.actions;
import { DateRangePicker } from 'react-dates';

class ResultTable extends Component {

  constructor(props) {
    super(props);
    props.getTestResults();
    this.state = {};
  }
  
  render(){
    let { testResults } = this.props;
    if(this.state.startDate && this.state.endDate){
      testResults = _.filter(testResults, (result) => {
        return moment(result.date).diff(this.state.startDate.startOf('day')) >= 0 && moment(result.date).diff(this.state.endDate.endOf('day')) <= 0
      });
    }
    return(
      <div className="pr-3 pl-3">
        <div className="row date-line">
        <DateRangePicker
          startDate={this.state.startDate} 
          startDateId="your_unique_start_date_id"
          endDate={this.state.endDate}
          endDateId="your_unique_end_date_id" 
          onDatesChange={({ startDate, endDate }) => this.setState({ startDate, endDate })}
          focusedInput={this.state.focusedInput}
          onFocusChange={focusedInput => this.setState({ focusedInput })}
          isOutsideRange={() => false}
        />
        </div>
        <div className="row">
          <table className="table">
            <thead className="thead-dark">
              <tr>
                <th scope="col">#</th>
                <th scope="col">{translate('user')}</th>
                <th scope="col">{translate('test')}</th>
                <th scope="col">{translate('mark')}</th>
                <th scope="col">{translate('date')}</th>
              </tr>
            </thead>
            <tbody>
              {_.map(testResults, (result, index) =>
                <tr key={index}>
                  <th scope="row">{index}</th>
                  <td>{result.userName}</td>
                  <td>{result.testName}</td>
                  <td>{result.mark}</td>
                  <td>{moment(result.date).format("DD/MM/YYYY HH:mm")}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state){
  return {
    testResults: state.test.testResults
  }
}

export default connect(mapStateToProps, testActions)(ResultTable);