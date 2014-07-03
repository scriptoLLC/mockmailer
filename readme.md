[![build status](https://secure.travis-ci.org/scriptoLLC/mockmailer.png)](http://travis-ci.org/scriptoLLC/mockmailer)

# mockmailer

A test framework agnostic mock for [nodemailer](https://github.com/andris9/Nodemailer) allowing you to test code that sends mail via nodemailer without actually sending mail.

Obviously you'll need `nodemailer` installed in your app that you're trying to test. This will use that version to prevent any oddities with two copies of nodemailer being present.

## Usage
```javascript
var test = require('tap').test;
var mockmailer = require('mockmailer');
var nodemailer = require('nodemailer');

test('do not send mail', function(t){
  var transport = nodemailer.createTransport('SMTP', {options: 'go here'});
  var sendOptions = {to: 'test@test.com'};
  var triggered = false;

  mockmailer(function(err, message){
    t.ok(triggered, 'Triggered original callback')
    t.ok(!err, 'Did not return an error');
    t.deepEqual(message.options, sendOptions, 'Returned correct options');
    t.equal(message.messageId, 'noid', 'mockmailer ID returned');
    t.equal(message.message, 'Caught by mockmailer', 'mockmailer message returned');
    t.end();
  });

  transport.sendMail(sendOptions, function(){
    triggered = true;
  });
});

test('simulate a failure', function(t){
  var transport = nodemailer.createTransport('STMP', {service: 'immafail'});
  var triggered = false;
  mockmailer.setFail(true);
  mockmailer(function(err, message){
    t.ok(err, 'Returned an error');
    t.ok(triggered, 'Triggered original callback');
    t.equal(err.message, 'failed by user request', 'Message is from mockmailer');
    t.end();
    mockmailer.setFail(false);
  });

  transport.sendMail({}, function(err){
    if(err){
      triggered = true;
    }
  });
});

```

## Installation

```
npm i -D mockmailer
```

## API

### mockmailer → `function(registeredCallback)`

```
/**
 * Supply a callback to be invoked when mail is sent that resolves or fails your test
 * @method  mockmailer
 * @async
 * @param   {function} registeredCallback The callback to invoke when `sendMail` is called
 * @returns {object} undefined
 */
```

### setFail → `function(fail)`
```
/**
 * Sets nodemailer to either fail or not when `sendMail` is called
 * @method setFail
 * @param  {boolean} mode Should nodemailer "fail" sending mail
 */
```

## License
mockmailer is ©2014 Scripto, LLC. Available for use under the [MIT License](LICENSE).
