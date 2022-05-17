var express = require('express');
var router = express.Router();
var productHelper = require('../helpers/product-helpers');
const userHelpers = require('../helpers/user-helpers');
var userhelper = require('../helpers/user-helpers')
var adminHelpers = require('../helpers/admin-helpers')
const WEEK_SECONDS = 7 * 24 * 60 * 60 * 1000;
const MONTH_SECONDS = 30 * 24 * 60 * 60 * 1000;
const YEAR_SECONDS = 365.25 * 24 * 60 * 60 * 1000;


const async = require('hbs/lib/async');
const collection = require('../config/collection');
const app = require('../app');
var client = require('twilio')(process.env.ACCOUNTS_ID, process.env.AUTH_TOKEN);
let message;


const verifyLogin = (req, res, next) => {
  if (req.session.adminlogged) {
    next()
  } else {
    res.redirect('/admin/login')
  }
}


/* GET users listing. */
router.get('/', verifyLogin, async function (req, res, next) {

  let productNos = await productHelper.getProductCount()
  let categoryNos = await productHelper.getCategoryCount()
  let userNos = await userHelpers.getUserCount()
  let totalSale = await productHelper.saleTotal()
  let paymentData = await productHelper.paymentTypeDetails()
  let saleAmounts = await productHelper.paymentTypeSale()

  let [online, cod, paypal] = paymentData
  let [onlineAm, codAm, paypalAm] = saleAmounts
  let topprd = await productHelper.topProducts()
  let top1 = await productHelper.findPro(topprd[0]._id)

  productHelper.getAllproduct(0, productNos).then((products) => {
    res.render('admin/dashboard', { products, dashboard: true, productNos, categoryNos, userNos, totalSale, top1, topprd, online, cod, paypal, onlineAm, codAm, paypalAm })
  })
})

router.get('/view-products', verifyLogin, async function (req, res, next) {

  
  let PerPage = 6;
  let TotalCount = await productHelper.getProductCount()
  let pages = Math.ceil(TotalCount / PerPage);
  let PageNum = (req.query.page == null) ? 1 : req.query.page;
  let startFrom = (PageNum - 1) * PerPage;
  let arr = [];
  for (var i = 1; i <= pages; i++) {
    arr.push(i)
  }

  productHelper.getAllproduct(startFrom,PerPage).then((products) => {
    res.render('admin/view-products', { products,arr })
  })
})


router.get('/login', function (req, res) {
  if (req.session.adminlogged) {
    res.redirect('/admin')
  }
  else {
    res.render('admin/admin-login', { message: "" })
  }
})

router.get('/logout', function (req, res) {
  req.session.adminlogged = false;
  res.redirect('/admin')
})


router.post('/login', function (req, res) {
  console.log(req.body.email)
  console.log(req.body.password)
  adminHelpers.doLogin(req.body.email, req.body.password).then((result) => {
    if (result.status) {
      req.session.adminlogged = true;
      res.redirect('/admin')
    }
    else {
      req.session.adminlogErr = "Invalid E-mail or Password";
      res.render('admin/admin-login', { message: req.session.adminlogErr })
    }
  })
})

router.get('/signup', function (req, res) {
  if (req.session.adminlogged) {
    res.redirect('/admin')
  }
  else {
    res.render('admin/sign-up')
  }
})


router.post('/signup', function (req, res) {
  req.session.adminData = req.body
  client.verify
    .services(process.env.SERVICE_ID)
    .verifications.create({
      to: `+91${req.body.number}`,
      channel: "sms"
    })
  res.redirect('/admin/signup-otp')
})
//admin signup-otp 
router.get('/signup-otp', function (req, res) {
  res.render('admin/get-otp', { message })
  message = ""

})
//
router.post('/signup-otp', function (req, res) {
  let otpcode = req.body.otpcode;
  client.verify
    .services(process.env.SERVICE_ID)
    .verificationChecks.create({
      to: `+91${req.session.adminData.number}`,
      code: otpcode
    }).then((response) => {
      if (response.valid) {
        client.verify
          .services(process.env.SERVICE_ID)
          .verifications.create({
            to: `+91${process.env.MAIN_ADMIN}`,
            channel: "sms"
          })
        res.redirect('/admin/main-otp')
      }
      else {
        message = "INVALID OTP"
        res.redirect('/admin/signup-otp')
      }
    })
})

router.get('/main-otp', function (req, res) {
  res.render('admin/main-otp', { message })

})


router.post('/main-otp', function (req, res) {
  let otpcode = req.body.otpcode;
  client.verify
    .services(process.env.SERVICE_ID)
    .verificationChecks.create({
      to: `+91${process.env.MAIN_ADMIN}`,
      code: otpcode
    }).then((response) => {
      if (response.valid) {
        adminHelpers.doSignUp(req.session.adminData).then((data, Id) => {
          req.session.adminlogged = true
          res.redirect('/admin')
        })
      }
      else {
        message = "INVALID OTP"
        res.redirect('/admin/main-otp')
      }
    })
})


router.get('/view-users', verifyLogin, function (req, res) {
  userhelper.getAllUsers().then((userlist) => {
    res.render('admin/view-users', { userlist })
  })
})


router.get('/add-products', verifyLogin, async function (req, res, next) {
  let categories = await productHelper.getAllCategory()
  let plants = await productHelper.getPlantCategory()
  let pot = await productHelper.getPotCategory()
  res.render('admin/add-products', { categories,plants,pot })
});

router.post('/add-products', verifyLogin, function (req, res) {
  productHelper.addProduct(req.body, (id) => {
    let Image = req.files.image
    Image.mv('./public/product-images/' + id + '.jpg', (err, done) => {
      if (!err)
        res.redirect('/admin/add-products')
      else {
        console.log(err)
      }
    })

  })
});


router.get('/delete-product/:id', verifyLogin, function (req, res) {
  let proId = req.params.id;
  productHelper.deleteProduct(proId).then((response) => {
    res.redirect('/admin')
  })
});

router.get('/edit-product/:id', verifyLogin, async function (req, res) {
  let proId = req.params.id;
  let categories = await productHelper.getAllCategory()
  productHelper.getProductInfo(proId).then((item) => {
    product = item[0]
    res.render('admin/edit-products', { product, categories })
  })
})

router.post('/edit-product/:id', function (req, res) {
  let proId = req.params.id
  console.log(req.body)
  productHelper.updateProduct(proId, req.body).then((result) => {
    let image = req.files?.image;
    if (image) {
      image.mv('./public/product-images/' + proId + '.jpg');
      res.redirect('/admin')
    }
    else {
      res.redirect('/admin')
    }
  })
})

router.get('/view-users', verifyLogin, function (req, res) {
  res.render('admin/view-users')
})


router.get('/category', verifyLogin, function (req, res) {
  productHelper.getAllCategory().then((categoryList) => {
    res.render('admin/view-categories', { categoryList, val: "0" })
  })
})

router.get('/add-category', verifyLogin, function (req, res) {
  res.render('admin/add-category', {})
})


router.post('/add-category', function (req, res) {
  productHelper.addCategory(req.body.main, req.body.sub).then(() => {
    res.redirect('/admin')
  })
})

router.get('/delete-category/:name', verifyLogin, function (req, res) {
  let categoryName = req.params.name
  console.log(categoryName)
  productHelper.deleteCategory(categoryName).then((response) => {
    res.redirect('/admin/category')
  })
})

router.get('/block-user/:id', verifyLogin, function (req, res) {
  let UserId = req.params.id;
  userhelper.blockUsers(UserId).then((response) => {
    req.session.loggedIn = false;
    res.redirect('/admin/view-users')
  })

})

router.get('/unblock-user/:id', verifyLogin, function (req, res) {
  let UserId = req.params.id;
  userhelper.unblockUsers(UserId).then((response) => {
    res.redirect('/admin/view-users')
  })

})

router.get('/view-orders', verifyLogin, async function (req, res) {
  let PerPage = 10;
  let TotalCount = await productHelper.getOrderCount()
  let pages = Math.ceil(TotalCount / PerPage);
  let PageNum = (req.query.page == null) ? 1 : req.query.page;
  let startFrom = (PageNum - 1) * PerPage;
  let arr = [];
  for (var i = 1; i <= pages; i++) {
    arr.push(i)
  }
  let orderData = await userhelper.getAllUserOrders(startFrom, PerPage)
  res.render('admin/view-orders', { orderData, arr })
})


router.post('/view-orders', async function (req, res) {
  userhelper.updateAdminOrderStatus(req.body.orderId, req.body.orderState).then(() => {
    res.redirect('/admin/view-orders')
  })
})


router.get('/order-products/:id', verifyLogin, (async (req, res) => {
  let orderProducts = await userhelper.getOrderProducts(req.params.id)
  res.render('admin/order-products', { orderProducts })
}))


router.get('/change-status/:id', verifyLogin, function (req, res) {
  userhelper.updateOrderStatus(req.params.id).then(() => {
    res.redirect('/admin/view-orders')
  })
})

router.get('/add-thumbnails/:id', verifyLogin, function (req, res) {
  let productId = req.params.id;
  res.render('admin/add-thumbnails', { productId })
});

router.post('/add-thumbnails', function (req, res) {
  let image1 = req.files?.image1;
  let image2 = req.files?.image2;
  let image3 = req.files?.image3;
  let image4 = req.files?.image4;
  if (image1) {
    image1.mv('./public/thumbnails/' + req.body.productId + '1' + '.jpg', (err, done) => {
      if (err) {
        console.log(err)
      }
      else {
        console.log('success')
      }
    })
  }
  if (image2) {
    image1.mv('./public/thumbnails/' + req.body.productId + '2' + '.jpg', (err, done) => {
      if (err) {
        console.log(err)
      }
      else {
        console.log('success')
      }
    })
  }

  if (image3) {
    image1.mv('./public/thumbnails/' + req.body.productId + '3' + '.jpg', (err, done) => {
      if (err) {
        console.log(err)
      }
      else {
        console.log('success')
      }
    })
  }

  if (image4) {
    image1.mv('./public/thumbnails/' + req.body.productId + '4' + '.jpg', (err, done) => {
      if (err) {
        console.log(err)
      }
      else {
        console.log('success')
      }
    })
  }
  res.redirect('/admin')

});

router.get('/view-reports', verifyLogin, async function (req, res) {
  let totalSale = await productHelper.saleTotal()
  res.render('admin/view-reports')
});


router.get('/weekly-report', verifyLogin, function (req, res) {
  let nowDate = new Date();
  let previousWeek = new Date(nowDate - WEEK_SECONDS)
  userHelpers.getWeekReport(previousWeek).then((response) => {
    report = response
    res.render('admin/weekly-report', { report })
  })
})

router.get('/monthly-report', verifyLogin, function (req, res) {
  let nowDate = new Date();
  let previousMonth = new Date(nowDate - MONTH_SECONDS)
  userHelpers.getMonthReport(previousMonth).then((response) => {
    report = response
    res.render('admin/monthly-report', { report })
  })
})

router.get('/yearly-report', verifyLogin, function (req, res) {
  let nowDate = new Date();
  let previousYear = new Date(nowDate - YEAR_SECONDS)
  userHelpers.getYearReport(previousYear).then((response) => {
    report = response
    res.render('admin/yearly-report', { report })
  })
})

router.post('/search-report', async function (req, res) {
  let start = new Date(req.body.startDate)
  let end = new Date(req.body.endDate)
  userHelpers.searchReports(start, end).then((result) => {
    productHelper.orderRangeTotal(start, end).then((total) => {
      res.render('admin/view-reports', { result, total })
    })
  })
})


router.get('/add-category-offer/:id', verifyLogin, function (req, res) {
  let name = req.params.id;
  req.session.category = name;
  res.render('admin/category-offer', { name })
})


router.post('/add-category-offer', function (req, res) {
  productHelper.addCategoryOffer(req.body.categoryOffer, req.session.category).then(() => {
    res.redirect('/admin/category')
  })
})


router.get('/coupens', verifyLogin, async function (req, res) {
  let day = new Date()
  day = day.toISOString().split("T")[0]
 
  let extCoupen = await userHelpers.getCoupens().catch(() => {
  })

  res.render('admin/add-coupen', { day, extCoupen })
})


router.post('/coupens', function (req, res) {

  userHelpers.createCoupen(req.body).then(() => {
    res.redirect('/admin/coupens')
  })
})

router.get('/referal-offer', verifyLogin,async  function (req, res) {

  let extReferal = await userHelpers.getExtReferal().catch(() => {
  })
  let day = new Date()
  day = day.toISOString().split("T")[0]

  res.render('admin/referal', { day,extReferal })
})


router.post('/referal-offer', function (req, res) {
  userHelpers.CreateReferal(req.body).then(() => {
    res.redirect('/admin/referal-offer')
  })

})

router.get('/deleteCoupon/:id', verifyLogin, function (req, res) {
  userHelpers.deleteCoupon(req.params.id).then(() => {
    res.json({ status: true })
  })
})

router.get('/deleteReferal/:id', verifyLogin, function (req, res) {
  userHelpers.deleteReferal(req.params.id).then(() => {
    res.json({ status: true })
  })
})



module.exports = router;
