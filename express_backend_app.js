var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var Web3 = require('web3');
var ethereumJsUtil = require('ethereumjs-util');
var abi = require('ethereumjs-abi');

var web3 = new Web3('https://main-rpc.linkpool.io');  // Thank you linkpool for your free geth node!
var account = web3.eth.accounts.privateKeyToAccount(privateKey);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', express.static('public'));
app.use('/airdrop', function(req, res, next){
  let sig = req.query.sig;
  let addr = req.query.address;
  web3.eth.getBlockNumber().then(console.log);
  const msgBuffer = ethereumJsUtil.toBuffer(addr);
  const msgHash = ethereumJsUtil.hashPersonalMessage(msgBuffer);
  const signatureBuffer = ethereumJsUtil.toBuffer(sig);
  const signatureParams = ethereumJsUtil.fromRpcSig(signatureBuffer);
  const publicKey = ethereumJsUtil.ecrecover(
    msgHash,
    signatureParams.v,
    signatureParams.r,
    signatureParams.s
  );
  const addressBuffer = ethereumJsUtil.publicToAddress(publicKey);
  const address = ethereumJsUtil.bufferToHex(addressBuffer);

  if(addr == address) {
    web3.eth.getBalance(addr, 10169000).then(function(balance) {
	bigIntBalance = BigInt(balance);
      console.log(bigIntBalance);
      if (bigIntBalance < 0.1E18) {
        return res.status(400).send({
          message: 'Balance is less than 0.1 ETH'
       });
      }
      if(bigIntBalance > BigInt(10E18)) {
        bigIntBalance = BigInt(10E18);
      }
      tokens = bigIntBalance * BigInt(100);
      sig = signPayment(addr, tokens.toString())
      return res.jsonp({tokens: tokens.toString(), sig: sig})
    }
    );
    
  } else {
    return res.status(400).send({
      message: 'Error validating signature'
   });
  }

  return
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log(err)
  console.log("Error")
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// recipient is the address that should be paid.
// amount, in wei, specifies how much ether should be sent.
function signPayment(recipient, amount) {
  var hash = "0x" + abi.soliditySHA3(
    ["address", "uint256"],
    [recipient, amount]
  ).toString("hex");

  return account.sign(hash);
}

module.exports = app;
//send the user to 500 page without shutting down the server
process.on('uncaughtException', function (err) {
  console.log('-------------------------- Caught exception: ' + err);
});
