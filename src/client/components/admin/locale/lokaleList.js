import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import localeModule from '../../../store/modules/locale';
const localeActions = localeModule.actions;

import { translate } from '../../../lib/translater';

class lokaleList extends Component{

  constructor(props){
    super(props);
    this.state = {
      locales: _.map(this.props.locale, (value, key)=>{return { key, value }})
    };
    this.addNewRow = this.addNewRow.bind(this);
    this.onChangeKey = this.onChangeKey.bind(this);
    this.onChangeValue = this.onChangeValue.bind(this);
    this.onDeleteRow = this.onDeleteRow.bind(this);
    this.saveLocale = this.saveLocale.bind(this);
    this.onChangeLanguage = this.onChangeLanguage.bind(this);
  }

  componentWillReceiveProps(nextProps){
    if(this.props.locale != nextProps.locale){
      let locales = _.map(nextProps.locale, (value, key)=>{return { key, value }});
      this.setState({ locales });
    }
  }

  addNewRow(){
    let locales = this.state.locales.slice();
    locales.unshift({ key: "", value: ""});
    this.setState({ locales });
  }

  onChangeKey(index, event){
    let locales = this.state.locales.slice();
    locales[index].key = event.target.value;
    this.setState({ locales });
  }

  onChangeValue(index, event){
    let locales = this.state.locales.slice();
    locales[index].value = event.target.value;
    this.setState({ locales });        
  }

  onDeleteRow(index){
    let locales = this.state.locales.slice();
    locales.splice(index, 1);
    this.setState({ locales });
  }

  saveLocale(){
    let locales = _.mapValues(_.keyBy(this.state.locales, 'key'), 'value');
    this.props.saveLocale(locales);
  }

  onChangeLanguage(language){    
    if(this.props.localeName != language){
      this.props.getLocale(language);
    }
  }

  render(){
    let lokaleKeys = _.map(this.props.allLocale, 'key'); 
    return(
      <div>
        <div className="row ml-2">
        <div className="col-12">
          <button className="m-1 btn btn-secondary" onClick={this.addNewRow}>{translate('add new')}</button>
          <button onClick={this.saveLocale} className="m-1 btn btn-secondary">{translate('save')}</button>
          <div className="btn-group">
            <button type="button" className="dropdown-toggle btn btn-secondary" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              {this.props.localeName}
            </button>
            <div className="dropdown-menu">
              {lokaleKeys.map((item) =>
                <a onClick={(e)=>this.onChangeLanguage(item)} className="dropdown-item">{item}</a> 
              )}
            </div>
          </div>
        </div>
        </div>
        <div className="row ml-4">
          <div className="col-4">{translate('Key word')}</div>
          <div className="col-4">{translate('Translate word')}</div>
          <div className="col-4">{translate('Buttons')}</div>
        </div>
        <ul>
          {this.state.locales.map((item, i) => 
            <li key={i}>
              <div className="row">
                <div className="col-4">
                  <input onChange={(e)=>this.onChangeKey(i, e)} type="text" className="form-control" value={item.key}/>
                </div>
                <div className="col-4">
                  <input onChange={(e)=>this.onChangeValue(i, e)} type="text" className="form-control" value={item.value}/>
                </div>
                <div className="col-4">
                  <button type="button" className="btn btn-link" onClick={()=>this.onDeleteRow(i)}>delete</button>
                </div>
              </div>
            </li>
          )}          
        </ul>
      </div>
    );
  }
}

function mapStateToProps(state){
  return {
    localeName: state.locale.localeName,
    locale: state.locale.locale,
    allLocale: state.locale.allLocale  
  }
}

export default connect(mapStateToProps, localeActions)(lokaleList);