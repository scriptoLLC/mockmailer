'use strict';

var nodemailer = require('nodemailer');

var transportArgs;
var sendOptions;
var sendCallback;
var shouldFail = false;
var suppliedCallback;
var triggered = false;
var response = {
  message: 'Caught by mockmailer',
  messageId: 'noid'
};
var error = new Error('failed by user request');

nodemailer.createTransport = function(){
  transportArgs = Array.prototype.slice.call(arguments);
  return {
    sendMail: function(opts, cb){
      sendOptions = opts;
      sendCallback = cb;
      triggered = true;
      delete response.options;
      delete response.sendCallback;

      if(typeof cb === 'function'){
        cb(shouldFail ? error : null, response);
      }

      if(typeof suppliedCallback === 'function'){
        response.options = sendOptions;
        response.callback = sendCallback;
        suppliedCallback(shouldFail ? error : null, response);
        triggered = false;
      }
    }
  };
};

/**
 * Supply a callback to be invoked when mail is sent that resolves or fails your test
 * @method  mockmailer
 * @async
 * @param   {function} registeredCallback The callback to invoke when `sendMail` is called
 * @returns {object} undefined
 */
var mockmailer = module.exports = function(registeredCallback){
  if(typeof registeredCallback === 'function'){
    suppliedCallback = registeredCallback;
    if(triggered){
      response.options = sendOptions;
      response.callback = sendCallback;
      suppliedCallback(shouldFail ? error : null, response);
      triggered = false;
    }
  }
};

/**
 * Sets nodemailer to either fail or not when `sendMail` is called
 * @method setFail
 * @param  {boolean} mode Should nodemailer "fail" sending mail
 */
mockmailer.setFail = function(mode){
  shouldFail = !!mode;
};