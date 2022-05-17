

var express = require('express');
const { response } = require('../app');
var router = express.Router();
var productHelper = require('../helpers/product-helpers');
let userHelpers = require('../helpers/user-helpers');
var twilio = require('../config/twilio');
const async = require('hbs/lib/async');
var client = require('twilio')(process.env.ACCOUNTS_ID, process.env.AUTH_TOKEN);
var paypal = require('paypal-rest-sdk');

const collection = require('../config/collection');

let coupenApplied = false;
let coupenMsg = ""
let coupenValid;
let mycoupen;
let referalOffer;
let referValid;
let referalApply = false;

console.log(process.env)

paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': process.env.CLIENT,
  'client_secret': process.env.SECRET
});

const verifyLogin = (req, res, next) => {
  if (req.session.loggedIn) {
    next()
  } else {
    res.redirect('/login')
  }
}

/* GET home page. */
router.get('/', async function (req, res, next) {
  let userLogged = req.session.loggedIn
  if (userLogged) {
    let user = req.session.user;
    let cartCount = await userHelpers.getCartCount(req.session.userId);
    let pots = await productHelper.getAllPotCategory();
    let Plants = await productHelper.getAllPlantCategory();
    let currentTime = new Date()
    let expirycheck = await userHelpers.coupenExpireCheck(currentTime).catch(() => {
      console.log("No Coupen Found")
    })
    mycoupen = await userHelpers.getMyCoupen().catch(() => {
      console.log("No Coupen Found")
    })

    coupenValid = await userHelpers.myCoupenValidity(req.session.userId, currentTime).catch(() => {
      console.log("No Coupen Available")
    })

    referalOffer = await userHelpers.referalOfferCheck().catch((err) => {
      console.log(err)
    })
    referValid = await userHelpers.myReferalCheck(req.session.userId).catch((err) => {
      console.log(err)
    })

    let PerPage = 6;
    let TotalCount = await productHelper.getProductCount()
    let pages = Math.ceil(TotalCount / PerPage);
    let PageNum = (req.query.page == null) ? 1 : req.query.page;
    let startFrom = (PageNum - 1) * PerPage;
    let arr = [];
    for (var i = 1; i <= pages; i++) {
      arr.push(i)
    }

    productHelper.getAllproduct(startFrom, PerPage).then((products) => {

      res.render('user/view-product', { products, user, cartCount, pots, home: true, Plants, arr });
    })
  }
  else {

    let PerPage = 6;
    let TotalCount = await productHelper.getProductCount()
    let pages = Math.ceil(TotalCount / PerPage);
    let PageNum = (req.query.page == null) ? 1 : req.query.page;
    let startFrom = (PageNum - 1) * PerPage;
    let arr = [];
    for (var i = 1; i <= pages; i++) {
      arr.push(i)
    }
    let pots = await productHelper.getAllPotCategory();
    let Plants = await productHelper.getAllPlantCategory();
    productHelper.getAllproduct(startFrom, PerPage).then((products) => {
      res.render('user/view-product', { products, pots, Plants, arr });
    })
  }
});






router.get('/show-category/:id', async function (req, res) {
  if (req.session.loggedIn) {
    user = req.session.user;
  }

  else {
    user = 0;
  }
  let pots = await productHelper.getAllPotCategory();
  let Plants = await productHelper.getAllPlantCategory();
  let pro = await productHelper.getCategoryPro(req.params.id)
  if (pro) {
    console.log("product found")
    res.render('user/view-categoryPro', { pro, pots, Plants, user, home: true })
  }
  else {
    console.log("product  not found")
    let message = "No Items Found!"
    res.render('user/view-categoryPro', { message, pots, Plants, user, home: true })
  }
})



router.get('/login', function (req, res) {
  let userLogged = req.session.loggedIn
  if (userLogged) {
    res.redirect('/')
  }
  else {
    res.render('user/login', { message: req.session.loginErr, changePassword: req.session.passwordMessage })
    req.session.passwordMessage = "";
    req.session.loginErr = "";
  }
});


router.post('/login', function (req, res) {
  userHelpers.doLogin(req.body).then((result) => {
    if (result.status) {
      req.session.user = result.user
      req.session.userId = result.user._id;
      req.session.loggedIn = true;
      res.redirect('/')
    }
    else if (result.blocked) {
      req.session.loginErr = "User is Blocked"
      res.redirect('/login')
    }
    else {
      req.session.loginErr = "Invalid Username or Password"
      res.redirect('/login')
    }
  }).catch((err) => {
    console.log("login error", err)
  })
});


router.get('/signup', function (req, res) {

  if (req.query.id) {
    req.session.referal = req.query.id
  }
  else {
    req.session.referal = ""
  }

  let userLogged = req.session.loggedIn
  if (userLogged) {
    res.redirect('/')
  }
  else {
    res.render('user/signup', { message: "" })
  }
});


router.post('/signup', async function (req, res) {
  req.session.newSignup = req.body;
  userHelpers.existMailChecker(req.body.email).then(() => {
    client.verify
      .services(process.env.SERVICE_ID)
      .verifications.create({
        to: `+91${req.body.number}`,
        channel: "sms"
      })
    res.redirect('/signup-otp')
  }).catch(() => {
    req.session.message = "Email is already exists"
    res.render('user/signup', { message: "Email Id already exists" })
  })
}
);


router.get('/signup-otp', ((req, res) => {
  res.render('user/getSignup-otp', { message: "" })
}));

router.post('/signup-otp', ((req, res) => {
  let otpcode = req.body.otpcode;
  client.verify
    .services(process.env.SERVICE_ID)
    .verificationChecks.create({
      to: `+91${req.session.newSignup.number}`,
      code: otpcode
    }).then((response) => {
      if (response.valid) {
        userHelpers.doSignUp(req.session.newSignup, req.session.referal).then((data) => {
          req.session.user = req.session.newSignup;
          req.session.userId = data.insertedId;
          req.session.loggedIn = true;
          res.redirect('/')
        })
      }
      else {
        res.render('user/getSignup-otp', { message: "OTP NOT CORRECT" })
      }
    })
}
));


router.get('/otplogin', function (req, res) {
  if (req.session.loggedIn) {
    res.redirect('/')
  }
  else {
  }
  res.render('user/otplogin', { message: "" })
});

router.post('/otplogin', function (req, res) {
  userHelpers.mobileNumberCheck(req.body.number).then((NumberStatus) => {
    req.session.mobileNumber = req.body.number;
    if (NumberStatus) {
      client.verify
        .services(process.env.SERVICE_ID)
        .verifications.create({
          to: `+91${req.body.number}`,
          channel: "sms"
        }).then((resp) => {
          res.redirect('/getotp')
        })
    }

    else {
      req.session.numberCheck = "Mobile Number not verified"
      res.render('user/otplogin', { message: req.session.numberCheck })
    }
  })
});

router.get('/getotp', function (req, res) {
  if (req.session.loggedIn) {
    res.redirect('/')
  }
  else {
    res.render('user/otp-get', { otpmessage: "" })
  }
});

router.post('/getotp', function (req, res) {
  let otpcode = req.body.otpcode;
  client.verify
    .services(process.env.SERVICE_ID)
    .verificationChecks.create({
      to: `+91${req.session.mobileNumber}`,
      code: otpcode
    }).then((response) => {
      if (response.valid) {
        userHelpers.getUserdetailsWithMobile(req.session.mobileNumber).then((result) => {
          if (result.blockStatus == false || result.blockStatus == null) {
            req.session.user = result
            req.session.userId = result._id
            req.session.loggedIn = true;
            res.redirect('/')
          }
          else {
            req.session.loginErr = "User is Blocked"
            res.redirect('/login')
          }
        })
      }
      else {
        res.render('user/otp-get', { otpmessage: "INCORRECT OTP" })
      }
    }
    )
});


//password change

router.get('/forgot-password', function (req, res) {
  if (req.session.loggedIn) {
    res.redirect('/')
  }
  else {

    res.render('user/forgot-password', { otpmessage: req.session.otpErr })
    req.session.otpErr = "";
  }
});


router.post('/forgot-password', async function (req, res) {
  req.session.mobileNumber = req.body.number;
  if (req.session.loggedIn) {
    res.redirect('/')
  }
  else {
    let existNum = await userHelpers.mobileNumberCheck(req.body.number)
    if (existNum) {
      client.verify
        .services(process.env.SERVICE_ID)
        .verifications.create({
          to: `+91${req.body.number}`,
          channel: "sms"
        }).then((resp) => {
          res.redirect('/password-otp')
        })
    }
    else {
      req.session.otpErr = "Mobile number Not exist!"
      res.redirect('/forgot-password')
    }
  }
});


router.get('/password-otp', function (req, res) {
  if (req.session.loggedIn) {
    res.redirect('/')
  }
  else {

    res.render('user/password-otp', { message: req.session.otpErr })
    req.session.otpErr = ""

  }
});

router.post('/password-otp', function (req, res) {
  if (req.session.loggedIn) {
    res.redirect('/')
  }
  else {

    let otpcode = req.body.otpcode;
    client.verify
      .services(process.env.SERVICE_ID)
      .verificationChecks.create({
        to: `+91${req.session.mobileNumber}`,
        code: otpcode
      }).then((response) => {
        if (response.valid) {
          res.redirect('/change-password')
        }
        else {
          req.session.otpErr = "INCORRECT OTP"
          res.redirect('/password-otp')
        }
      })
  }
});

router.get('/change-password', ((req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/')
  }
  else {
    res.render('user/change-password')
  }
}));
router.post('/change-password', ((req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/')
  }
  else {
    userHelpers.passwordUpdate(req.session.mobileNumber, req.body.password).then(() => {
      req.session.passwordMessage = "Password Changed successfully"
      res.redirect('/login')

    })
  }
}));



router.get('/item-view/:id', verifyLogin, function (req, res) {
  let user = req.session.user
  let itemCode = req.params.id
  productHelper.getProductInfo(itemCode).then((productInfo) => {
    res.render('user/product-main', { productInfo, user, cartCount: req.session.cartCount })
  })

});


router.get('/logout', function (req, res) {
  req.session.user = null;
  req.session.loggedIn = false;
  res.redirect('/')
});



router.get('/add-to-cart/:id', async (req, res) => {
  if (req.session.loggedIn) {
    userHelpers.addToCart(req.params.id, req.session.userId).then(() => {
      res.json({ status: true })
    })
  }
  else {
    res.render('user/login')
  }
});


router.get('/view-cart', async (req, res) => {
  let userId = req.session.userId
  let user = req.session.user
  let cartCount = await userHelpers.getCartCount(req.session.userId);
  if (req.session.loggedIn) {
    total = await userHelpers.getTotalAmount(req.session.userId);
    userHelpers.getCartProducts(req.session.userId).then((cartProducts) => {
      res.render('user/view-cart', { cartProducts, userId, cartCount, total, user })
    })
  }
  else {
    res.redirect('/login')
  }
});



router.post('/change-product-quantity', ((req, res) => {
  userHelpers.changeQuantity(req.body).then(async (result) => {
    result.total = await userHelpers.getTotalAmount(req.body.User);
    res.json(result)
  })
}));

router.get('/apply-referal', ((req, res) => {
  referalApply = true;
  res.json({ status: true })

}));


router.post('/coupen-check', async (req, res) => {
  if (req.session.loggedIn) {
    if (req.body.userCoupen == mycoupen?.code && coupenValid.status) {
      coupenApplied = true;
      coupenMsgSuccess = "Coupen Applied Successfully"
      res.redirect('/place-order')

    }

    else {
      coupenMsg = "INVALID COUPEN"
      res.redirect('/place-order')
    }
  }
  else {
    res.redirect('/')
  }
})


router.get('/place-order', async (req, res) => {
  let user = req.session.user
  let cartCount = await userHelpers.getCartCount(req.session.userId);
  let addresslist = await userHelpers.getAddressList(req.session.userId)
  let discount = await userHelpers.getDiscount(req.session.userId)
  var discountVal;
  if (discount) {
    discountVal = discount / 100;
  }
  else {
    discountVal = 0;
  }
  discountVal = Number(discountVal).toFixed(2)
  req.session.discountVal = discountVal;




  if (req.session.loggedIn) {

    let referalMsg;
    let referalDisc = 0;
    if (referValid.status && referalOffer.status) {
      referalMsg = "You are eligible for referal offer"
    }

    if (coupenValid.status && coupenApplied) {
      let total = await userHelpers.getTotalAmount(req.session.userId)
      total = Number(total).toFixed(2)
      req.session.total = total;
      var coupenDisc = total * mycoupen.discount / 100;

      if (coupenDisc) {
        coupenDisc = coupenDisc.toFixed(2)
      }
      else {
        coupenDisc = 0;
      }
      if (!coupenDisc) {
        coupenDisc = 0;
      }

      if (referalApply) {
        referalDisc = total * referalOffer.discount / 100
        referalDisc = Number(referalDisc).toFixed(2)
        referalMsg = ""
      }

      let orderFinal = total - discountVal - coupenDisc - referalDisc
      orderFinal = Number(orderFinal).toFixed(2)
      req.session.orderAmt = orderFinal
      res.render('user/place-order', { total, User: req.session.user.email, cartCount, user, addresslist, discountVal, orderFinal, coupenDisc, coupenMsg, coupenMsgSuccess, referalMsg, referalDisc })
      coupenMsg = "";
      coupenMsgSuccess = ""
    }

    else {

      let total = await userHelpers.getTotalAmount(req.session.userId)
      total = Number(total).toFixed(2)
      req.session.total = total;
      if (referalApply) {
        referalDisc = total * referalOffer.discount / 100
        referalDisc = Number(referalDisc).toFixed(2)
        referalMsg = ""
      }
      let orderFinal = total - discountVal - referalDisc
      orderFinal = Number(orderFinal).toFixed(2)
      req.session.orderAmt = orderFinal
      res.render('user/place-order', { total, User: req.session.user.email, cartCount, user, addresslist, discountVal, orderFinal, coupenMsg, referalMsg, referalDisc })
      coupenMsg = "";
    }
  }
  else {
    res.redirect('/login')
  }
});


router.post('/place-order', async (req, res) => {
  let user = req.session.userId;
  let paypalAmt = req.session.orderAmt
  paypalAmt = paypalAmt.toString()
  let products = await userHelpers.getCartProductList(req.session.userId)
  userHelpers.placeOrder(user, req.body, products, req.session.orderAmt).then((orderId) => {
    req.session.orderId = orderId;
    if (req.body['payment-method'] === "COD") {
      res.json({ codStatus: true })
    }
    else if (req.body['payment-method'] === "PAYPAL") {

      var create_payment_json = {
        "intent": "sale",
        "payer": {
          "payment_method": "paypal"
        },
        "redirect_urls": {
          "return_url": "http://localhost:3000/success",
          "cancel_url": "http://localhost:3000/cancel"
        },
        "transactions": [{
          "item_list": {
            "items": [{
              "name": "item",
              "sku": "001",
              "price": paypalAmt,
              "currency": "USD",
              "quantity": 1
            }]
          },
          "amount": {
            "currency": "USD",
            "total": paypalAmt
          },
          "description": "This is the payment description."
        }]
      };

      paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
          throw error;
        }
        else {
          for (var i = 0; i < payment.links.length; i++) {
            if (payment.links[i].rel === "approval_url") {
              let link = payment.links[i].href;
              link = link.toString()
              res.json({ paypal: true, url: link })

            }
          }

        }

      })
    }
    else {
      userHelpers.generateRazorPay(orderId, req.session.orderAmt).then((response) => {
        res.json(response)
      })

    }

  })

});


router.get('/success', (req, res) => {
  if (req.session.loggedIn) {
    let paypalAmt = req.session.orderAmt
    paypalAmt = paypalAmt.toString()
    const payerId = req.query.PayerID
    const paymentId = req.query.paymentId
    var execute_payment_json = {
      "payer_id": payerId,
      "transactions": [{
        "amount": {
          "currency": "USD",
          "total": paypalAmt
        }
      }]
    }

    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
      if (error) {
        console.log(error.response);
        throw error;
      } else {
        userHelpers.changeOrderStatus(req.session.orderId).then(() => {
          res.redirect('/order-success')
        })
      }
    });

  }
  else {
    res.render('user/login')
  }
})


router.get('/cancel', (req, res) => {
  res.send('cancel')
})

router.get('/add-address', verifyLogin, (req, res) => {
  res.render('user/user-address')
})

router.post('/add-address', (req, res) => {
  if (req.session.loggedIn) {
    userHelpers.addNewAddress(req.session.userId, req.body).then(() => {
      res.redirect('/place-order')
    })
  }
  else {
    res.render('user/login')
  }
});

router.get('/order-success', verifyLogin, ((req, res) => {
  if (referalApply) {
    userHelpers.updateReferalApplied(req.session.userId).then(() => {
      referalApply = false;
    })
  }
  if (coupenApplied) {
    coupenDisc = 0;
    userHelpers.updateCoupen(req.session.userId, mycoupen.code).then(() => {

    })
  }
    res.render('user/order-message')
}));


router.get('/view-orders', verifyLogin, async function (req, res) {
  let cartCount = await userHelpers.getCartCount(req.session.userId);
  let pots = await productHelper.getAllPotCategory();
  let Plants = await productHelper.getAllPlantCategory();
  let user = req.session.user;
  let orderData = await userHelpers.getUserOrders(req.session.userId)
  res.render('user/view-orders', { orderData, user,cartCount,pots,Plants,search:true })
});

router.post('/verify-payment', verifyLogin, async function (req, res) {
  console.log(req.body)
  userHelpers.verifyPayment(req.session.orderId, req.body).then(() => {
    userHelpers.changeOrderStatus(req.body.order.receipt).then(() => {
      res.json({ status: true })
    }).catch(() => {
      res.json({ status: false })
    })
  }).catch((err) => {
    console.log(err)
  })

})
  

router.get('/order-products/:id', verifyLogin, (async (req, res) => {
  let orderProducts = await userHelpers.getOrderProducts(req.params.id)
  res.render('user/order-products', { orderProducts, user })
}));


router.get('/view-profile', verifyLogin, async function (req, res) {
  let userData = await userHelpers.getUserData(req.session.userId)
  res.render('user/view-profile', { userData })
});



router.post('/view-profile', async function (req, res) {
  userHelpers.updateProfile(req.session.user._id, req.body).then(() => {
    res.redirect('/profile-message')
  })
});


router.get('/crop-images/:id',verifyLogin, (req, res) => {
  user = req.params.id
  res.render('user/crop-images', { crop: true, user })
})

router.post('/crop-images', (req, res) => {
  let user = req.body.user
  let image = req.body.image
  userHelpers.profilePicChange(user, image).then(() => {
    res.redirect('/view-profile')
  })
})

router.get('/profile-message', verifyLogin, function (req, res) {
  res.render('user/profile-message',)
});

router.get('/cancel-order/:id', verifyLogin, function (req, res) {
  userHelpers.updateOrderStatus(req.params.id).then(() => {
    res.redirect('/view-orders')
  })
});

router.get('/delete-address/:id', verifyLogin, function (req, res) {
  userHelpers.deleteAddress(req.params.id).then(() => {
    res.redirect('/place-order')
  })
});


router.get('/view-offers', verifyLogin, function (req, res) {


  res.render('user/offer-zone', { mycoupen, referalOffer, ID: req.session.userId })
});

router.get('/cartItemDelete/:id', verifyLogin, function (req, res) {
  userHelpers.cartItemDelete(req.params.id, req.session.userId).then(() => {
    res.json({ status: true })
  })
})





module.exports = router;
