var test = require('tap').test
var mockmailer = require('../')
var nodemailer = require('nodemailer')

test('do not send mail', function (t) {
  var transport = nodemailer.createTransport('SMTP', {options: 'go here'})
  var sendOptions = {to: 'test@test.com'}
  var triggered = false

  mockmailer(function (err, message) {
    t.ok(triggered, 'Triggered original callback')
    t.ok(!err, 'Did not return an error')
    t.deepEqual(message.options, sendOptions, 'Returned correct options')
    t.equal(message.messageId, 'noid', 'mockmailer ID returned')
    t.equal(message.message, 'Caught by mockmailer', 'mockmailer message returned')
    t.end()
  })

  transport.sendMail(sendOptions, function () {
    triggered = true
  })
})

test('simulate a failure', function (t) {
  var transport = nodemailer.createTransport('STMP', {service: 'immafail'})
  var triggered = false
  mockmailer.setFail(true)

  mockmailer(function (err) {
    t.ok(err, 'Returned an error')
    t.ok(triggered, 'Triggered original callback')
    t.equal(err.message, 'failed by user request', 'Message is from mockmailer')
    t.end()
  })

  transport.sendMail({}, function (err) {
    if (err) {
      triggered = true
    }
  })
})
