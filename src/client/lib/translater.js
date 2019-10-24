import _ from 'lodash';

let insideLocale;

function initTranslate(locale){
  insideLocale = locale;
}

function translate(text){
  text = text.trim();
  if(insideLocale && _.has(insideLocale, text)){
    return _.get(insideLocale, text);
  }
  return text;
}

export { initTranslate, translate };