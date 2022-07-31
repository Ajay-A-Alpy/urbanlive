
var db = require('../config/connection');
var collection = require('../config/collection');
const bcrypt = require('bcrypt');
const async = require('hbs/lib/async');
const { PRODUCT_COLLECTION } = require('../config/collection')
var ObjectId = require('mongodb').ObjectId
const Razorpay = require('razorpay');

const { resolve } = require('path');



var instance = new Razorpay({
    key_id: process.env.idKey,
    key_secret: process.env.secretkey,
});

module.exports = {

    doSignUp: (userData,referal) => {
        return new Promise(async (resolve, reject) => {
            let emailFinder = await db.get().collection(collection.USER_COLLECTION).findOne({ email: userData.email })
            if (emailFinder != null) {
                reject("errorMail")
            }
            else {
                let obj={}
                userData.password = await bcrypt.hash(userData.password, 10);
                if(referal){

                     obj={
                        fname:userData.fname,
                        lname:userData.lname,
                        email:userData.email,
                        number:userData.number,
                        password:userData.password,
                        referalStatus:true,
                        referalID:referal,
                        referalApplied:false
                    }
                }
                else{

                     obj={
                        fname:userData.fname,
                        lname:userData.lname,
                        email:userData.email,
                        number:userData.number,
                        password:userData.password

                }}

               

                userData.password = await bcrypt.hash(userData.password, 10);
                db.get().collection(collection.USER_COLLECTION).insertOne(obj).then((data) => {
                    resolve(data)

                })

            }
        })

    },



    existMailChecker: ((newMail) => {

        return new Promise(async (resolve, reject) => {
            let emailFinder = await db.get().collection(collection.USER_COLLECTION).findOne({ email: newMail })
            if (emailFinder != null) {
                reject("errorMail")
            }
            else {
                resolve()
            }

        })


    }),



    doLogin: ((loginData) => {

        return new Promise(async (resolve, reject) => {
            let response = {}

            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ email: loginData.email })

            if (user) {
                bcrypt.compare(loginData.password, user.password).then((status) => {

                    if (status) {

                        if (user.blockStatus) {
                            response.blocked = true;
                            resolve(response)

                        }

                        else {

                       
                            response.user = user
                            response.status = true

                            resolve(response)

                        }
                    }

                    else {
                   
                        resolve({ status: false })
                    }
                })
            }

            else {
            
                resolve({ status: false })
            }
        })
    }),





    getAllUsers: (() => {
        return new Promise(async (resolve, reject) => {
            let allUser = await db.get().collection(collection.USER_COLLECTION).find().toArray()
            resolve(allUser)

        })
    }),





    mobileNumberCheck: ((inputNumber) => {

        return new Promise(async (resolve, reject) => {

            let NumberExist = await db.get().collection(collection.USER_COLLECTION).findOne({ number: inputNumber })

            resolve(NumberExist);


        })
    }),



    blockUsers: ((UserId) => {
        return new Promise(async (resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).updateOne({ _id: ObjectId(UserId) }, { $set: { blockStatus: true } })
            resolve()

        })
    }),

    unblockUsers: ((UserId) => {
        return new Promise(async (resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).updateOne({ _id: ObjectId(UserId) }, { $set: { blockStatus: false } })
            resolve()

        })
    }),

    getUserdetailsWithMobile: ((userNum) => {
        return new Promise(async (resolve, reject) => {

            let userData = await db.get().collection(collection.USER_COLLECTION).findOne({ number: userNum })
            resolve(userData);
        })


    }),

    getOfferStatus: ((proId) => {

        return new Promise(async (resolve, reject) => {
            let product = await db.get().collection(collection.PRODUCT_COLLECTION).findOne({ _id: ObjectId(proId) })
            resolve(product)

        })

    }),


   profilePicChange: ((user,image) => {

        return new Promise(async (resolve, reject) => {
           db.get().collection(collection.USER_COLLECTION).updateOne({ _id: ObjectId(user) },{
               $set:{photo:image}
           })
            resolve()

        })

    }),



    addToCart: ((ProId, userId) => {


        let productObj = {
            item: ObjectId(ProId),
            quantity: 1,
            offerstatus: false,
            discount: 0

        }
        return new Promise(async (resolve, reject) => {
            let discountexist = db.get().collection(collection.PRODUCT_COLLECTION).findOne({ _id: ObjectId(ProId) })
            if (discountexist.discount != 0) {

                productObj.discount = discountexist.discount,
                    productObj.offerstatus = true
            }

            let userCart = await db.get().collection(collection.CART_COLLECTION).findOne({ userID: userId })
            if (userCart) {
                let proIndex = userCart.products.findIndex(product => product.item == ProId)

                if (proIndex != -1) {
                    db.get().collection(collection.CART_COLLECTION).updateOne({ userID: userId, 'products.item': ObjectId(ProId) },
                        {
                            $inc: { 'products.$.quantity': 1 }
                        }).then(() => {
                            resolve()
                        })
                }
                else {
                    db.get().collection(collection.CART_COLLECTION).updateOne({ userID: userId }, { $push: { products: productObj } }).then((response) => {
                        resolve()

                    })
                }
            }

            else {
                let cartObject = {
                    userID: userId,
                    products: [productObj]
                }
                db.get().collection(collection.CART_COLLECTION).insertOne(cartObject).then((response) => {
                    resolve(response)
                
                })
            }

        })
    }),




    getCartProducts: ((userId) => {

        return new Promise(async (resolve, reject) => {

            let cartItems = await db.get().collection(collection.CART_COLLECTION).aggregate([
                { $match: { userID: userId } }, {
                    $unwind: '$products'
                },
                {
                    $project: {
                        item: '$products.item',
                        quantity: '$products.quantity'
                    }
                },
                {
                    $lookup: {
                        from: collection.PRODUCT_COLLECTION,
                        localField: 'item',
                        foreignField: '_id',
                        as: 'product'
                    }

                },
                {
                    $project: {
                        item: 1, quantity: 1, product: { $arrayElemAt: ['$product', 0] }
                    }
                }

            ]).toArray()

            resolve(cartItems)
        })
    }),

    getCartCount: ((userId) => {

        return new Promise(async (resolve, reject) => {
            let count = 0;
            let cart = await db.get().collection(collection.CART_COLLECTION).findOne({ userID: userId })
            if (cart) {
                count = cart.products.length
                resolve(count)
            }
            else {
                resolve(count)
            }
        })

    }),



    changeQuantity: ((details) => {
        details.count = parseInt(details.count);
        details.qty = parseInt(details.qty);


        return new Promise((resolve, reject) => {

            if (details.count == -1 && details.qty == 1) {
                db.get().collection(collection.CART_COLLECTION).updateOne({ _id: ObjectId(details.cart) },
                    {
                        $pull: { products: { item: ObjectId(details.product) } }
                    })
                    .then((response) => {
                        resolve({ removeProduct: true })
                    })
            }
            else
                db.get().collection(collection.CART_COLLECTION).updateOne({ _id: ObjectId(details.cart), 'products.item': ObjectId(details.product) },
                    {
                        $inc: { 'products.$.quantity': details.count }
                    }).then((result) => {
                        resolve({ status: true })

                    })
        })
    }),

    getTotalAmount: ((userId) => {
        return new Promise(async (resolve, reject) => {
            let totalamt = await db.get().collection(collection.CART_COLLECTION).aggregate([
                { $match: { userID: userId } }, {
                    $unwind: '$products'
                },
                {
                    $project: {
                        item: '$products.item',
                        quantity: '$products.quantity'
                    }
                },
                {
                    $lookup: {
                        from: collection.PRODUCT_COLLECTION,
                        localField: 'item',
                        foreignField: '_id',
                        as: 'product'
                    }
                },
                {
                    $project: {
                        item: 1, quantity: 1, product: { $arrayElemAt: ['$product', 0] }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: { "$multiply": [{ $toInt: '$quantity' }, { $toInt: '$product.price' }] } }

                    }
                }
            ]).toArray()

            resolve(totalamt[0]?.total)
        })



    }),

    getDiscount: ((userId) => {

        return new Promise(async (resolve, reject) => {
            let totaldiscount = await db.get().collection(collection.CART_COLLECTION).aggregate([
                { $match: { userID: userId } },
                 {
                    $unwind: '$products'
                },
                {
                    $project: {
                        item: '$products.item',
                        quantity: '$products.quantity',
                    }
                },
                {
                    $lookup: {
                        from: collection.PRODUCT_COLLECTION,
                        localField: 'item',
                        foreignField: '_id',
                        as: 'product'
                    }
                },
                {
                    $project: {
                        item: 1, quantity: 1, product: { $arrayElemAt: ['$product', 0] }
                    }
                },
                {
                    $project: {
                        item:1,
                        quantity:1,
                        product:1,
                        discount:"$product.discount",
                        price:"$product.price"
                    }
                },

                { $match:  {discount:{$gt:"0"} }},

                {
                    $group: {
                        _id: null,
                        discount: { $sum: { "$multiply": [{ $toInt: '$quantity' }, { $toInt: '$product.discount' }, { $toInt: '$product.price' }] } }
                    }
                },
            ]).toArray()
  
            resolve(totaldiscount[0]?.discount)
        })

    }),








    placeOrder: ((userId, order, products, totalAmt) => {
        return new Promise(async (resolve, reject) => {

            let status = order["payment-method"] === 'COD' ? 'placed' : 'pending'
            let deliveryAddress = await db.get().collection(collection.ADDRESS_COLLECTION).findOne({ _id: ObjectId(order.addressId) })
            let orderObject = {
                deliveryDetails: deliveryAddress,
                userID: userId,
                userEmail: order.email,
                paymentMethod: order["payment-method"],
                products: products,
                status: status,
                amount: totalAmt,
                date: new Date()

            }

            db.get().collection(collection.ORDER_COLLECTION).insertOne(orderObject).then((response) => {

                db.get().collection(collection.CART_COLLECTION).deleteOne({ userID: userId })
                resolve(response.insertedId)
            })

        })


    }),

    getCartProductList: ((userId) => {

        return new Promise(async (resolve, reject) => {
            let cart = await db.get().collection(collection.CART_COLLECTION).findOne({ userID: userId })
            resolve(cart?.products)
        })
    }),

    getUserOrders: ((userId) => {
        return new Promise(async (resolve, reject) => {
            let order = await db.get().collection(collection.ORDER_COLLECTION).find({ userID: userId }).sort({date:-1}).toArray()
            resolve(order)
        })
    }),


    getOrderProducts: ((orderId) => {
        return new Promise(async (resolve, reject) => {
            let orderItems = await db.get().collection(collection.ORDER_COLLECTION).aggregate([
                { $match: { _id: ObjectId(orderId) } }, {
                    $unwind: '$products'
                },
                {
                    $project: {
                        item: '$products.item',
                        quantity: '$products.quantity',
                        amount:'$amount'
                    }
                },
                {
                    $lookup: {
                        from: collection.PRODUCT_COLLECTION,
                        localField: 'item',
                        foreignField: '_id',
                        as: 'product'
                    }
                },
                {
                    $project: {
                      amount:1, item: 1, quantity: 1, product: { $arrayElemAt: ['$product', 0] }
                    }
                }

            ]).toArray()
      
            resolve(orderItems)
        })

    }),

    getUserData: ((userId) => {
        return new Promise(async (resolve, reject) => {

            let userData = await db.get().collection(collection.USER_COLLECTION).findOne({ _id: ObjectId(userId) })
            resolve(userData);
        })
    }),


    updateProfile: (userId, userData) => {
        return new Promise((resolve, reject) => {

            db.get().collection(collection.USER_COLLECTION).updateOne({ _id: ObjectId(userId) }, {
                $set: {
                    fname: userData.fname,
                    lname: userData.lname,
                    email: userData.email,
                    number: userData.number,
                    address: userData.address,
                    place: userData.place,
                    district: userData.district,
                    district: userData.district,
                    pincode: userData.pincode,

                }
            }).then((response) => {

                resolve(response)
            })

        })
    }
    ,
    updateOrderStatus: ((orderId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.ORDER_COLLECTION).updateOne({ _id: ObjectId(orderId) },
                {
                    $set: { status: "cancelled", cancel: true }
                })
            resolve()

        })

    }),

    getAllUserOrders: ((start,limit) => {

        return new Promise(async (resolve, reject) => {
            
            let order = await db.get().collection(collection.ORDER_COLLECTION).find().skip(start).limit(limit).sort({date:-1}).toArray()
            
            resolve(order)
        })


    }),


    updateAdminOrderStatus: ((orderId, newStatus) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.ORDER_COLLECTION).updateOne({ _id: ObjectId(orderId) },
                {
                    $set: { status: newStatus }
                })

            resolve()

        })

    }),

    passwordUpdate: ((mobileNum, newPassWord) => {
        return new Promise(async (resolve, reject) => {
            passwordNew = await bcrypt.hash(newPassWord, 10);
            db.get().collection(collection.USER_COLLECTION).updateOne({ number: mobileNum },
                {
                    $set: { password: passwordNew }
                }).then(() => {
                    resolve()
                })


        })
    }),


    generateRazorPay: ((orderId, total) => {
        return new Promise((resolve, reject) => {

            instance.orders.create({
                amount: total * 100,
                currency: "INR",
                receipt: "" + orderId,

            }, function (err, order) {
                if (err) {
                    console.log(err)
                }
                else {
                    resolve(order)
                }
            })

        })

    }),


    verifyPayment: ((orderID, details) => {
   
        return new Promise((resolve, reject) => {
            const {
                createHmac,
            } = require('crypto');

            let hmac = createHmac('sha256', process.env.secretkey);
            hmac.update(details.payment.razorpay_order_id + "|" + details.payment.razorpay_payment_id);
            hmac = hmac.digest('hex')
            if (hmac == details.payment.razorpay_signature) {
                resolve()
            }
            else {
                reject("cannot hash")
            }
        })
    }),


    changeOrderStatus: ((orderId) => {

        return new Promise((resolve, reject) => {

            db.get().collection(collection.ORDER_COLLECTION).updateOne({ _id: ObjectId(orderId) }, {

                $set: { status: "placed" }

            }).then(() => {
                resolve()
            })

        })

    }),


    addNewAddress: ((userId, addressData) => {
        return new Promise((resolve, reject) => {
            let addressObj = {
                userID: userId,
                name: addressData.name,
                number: addressData.mobile,
                address: addressData.address,
                city: addressData.city,
                state: addressData.state,
                pincode: addressData.pincode,
                landmark: addressData.landmark
            }
            db.get().collection(collection.ADDRESS_COLLECTION).insertOne(addressObj).then(() => {
                resolve()
            })
        })
    }),

    getAddressList: ((userId) => {
        return new Promise(async (resolve, reject) => {
            let userAddress = await db.get().collection(collection.ADDRESS_COLLECTION).find({ userID: userId }).toArray()
            resolve(userAddress)
        })
    }),

    deleteAddress: ((addressId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.ADDRESS_COLLECTION).deleteOne({ _id: ObjectId(addressId) }).then(() => {
                resolve()
            })
        })
    }),

    getWeekReport: ((previousWeek) => {
        return new Promise(async (resolve, reject) => {
            let weeklyReport = await db.get().collection(collection.ORDER_COLLECTION).find({ date:{$gte:previousWeek}}).sort({date:-1}).toArray()
            resolve(weeklyReport)
        })
    }),

    getMonthReport: ((previousMonth) => {
        return new Promise(async (resolve, reject) => {
            let monthlyReport = await db.get().collection(collection.ORDER_COLLECTION).find({ date: { $gte: previousMonth } }).sort({date:-1}).toArray()
            resolve(monthlyReport)
        })
    }),

    getYearReport: ((previousYear) => {
        return new Promise(async (resolve, reject) => {
            let YearlyReport = await db.get().collection(collection.ORDER_COLLECTION).find({ date: { $gte: previousYear } }).sort({date:-1}).toArray()
            resolve(YearlyReport)
        })
    }),

    createCoupen:((coupen)=>{
        return new Promise((resolve,reject)=>{
            let obj={
                code:coupen.code,
                startDate:coupen.startDate.toString(),
                endDate:coupen.endDate.toString(),
                discount:coupen.discount,
                users:[],
                status:true

            }
            db.get().collection(collection.COUPEN_COLLECTION).insertOne(obj).then(()=>{
                resolve()
            })
        })
    
    }),

    getMyCoupen:(()=>{
        return new Promise(async(resolve,reject)=>{
         let coupen= await db.get().collection(collection.COUPEN_COLLECTION).findOne({status:true})
         if(coupen){
            resolve(coupen)
         }
         else{
             reject("no coupens found")
         }
         
        })
    
    }),

    myCoupenValidity:((user,date)=>{

        return new Promise(async(resolve,reject)=>{

            let coupen= await db.get().collection(collection.COUPEN_COLLECTION).findOne({status:true})
            if(coupen){
             
                let userexist = coupen.users.includes(user)
                if(userexist){

                    resolve({status:false})
                }
                else{
             
                  let  nowDate=date.toISOString().split("T")[0]
                  
      
                    if(nowDate<=coupen.endDate && nowDate>=coupen.startDate){
                 
                        resolve({ status: true, disc: coupen.discount })
                    }
                    else {
                        resolve({ status: false })
                    }
                }
            }
            else {
                resolve({ status: false })
            }


        })

    }),

    updateCoupen: ((userID, coupenCode) => {
        return new Promise(async (resolve, reject) => {
            db.get().collection(collection.COUPEN_COLLECTION).updateOne({ code: coupenCode }, {
                $push: { users: userID }
            }).then(() => {
                resolve()
            })

        })

    }),
    coupenExpireCheck: ((currentTime) => {

        return new Promise(async (resolve, reject) => {
            let coupen = await db.get().collection(collection.COUPEN_COLLECTION).findOne({ status: true })
            let nowDate = currentTime.toISOString().split("T")[0]
            if (coupen) {
                if (nowDate > coupen?.endDate) {
                    db.get().collection(collection.COUPEN_COLLECTION).updateOne({ status: true }, {
                        $set: { status: false }
                    }).then(() => {
                        resolve()
                    })
                }
                else {
                    resolve()
                }
            }
            else {
                reject("no coupen found")
            }
        })
    }),

CreateReferal:((data)=>{
    return new Promise((resolve,reject)=>{
        let obj={
          
            startDate:data.startDate,
            endDate:data.endDate,
            discount:data.discount,
            status:true
        }
        db.get().collection(collection.REFERAL_COLLECTION).insertOne(obj).then(()=>{
            resolve()
        })
    })


  

    

}),

referalOfferCheck:(()=>{
  
    return new Promise(async(resolve,reject)=>{
        let offer= await db.get().collection(collection.REFERAL_COLLECTION).findOne({status:true})
        if(offer){
           resolve(offer)
        }
        else{
            reject("no offers found")
        }
        
       })

}),

myReferalCheck:((user)=>{
    return new Promise(async(resolve,reject)=>{
        let referal= await db.get().collection(collection.USER_COLLECTION).findOne({
            referalID:user,
            referalApplied:false
        })
        if(referal){
           resolve({status:true})
        }
        else{
            resolve({status:false})
        }
       })
}),


updateReferalApplied:((user)=>{
    return new Promise(async(resolve,reject)=>{
      db.get().collection(collection.USER_COLLECTION).updateOne({
            referalID:user,
            referalApplied:false
        },{
            $set:{referalApplied:true}
        }).then(()=>{
            resolve()
        })
    
       })
}),

searchReports:((start,end)=>{


    return new Promise(async (resolve, reject) => {
        let searchReport = await db.get().collection(collection.ORDER_COLLECTION).find({ date: { $gte: start, $lte:end } }).sort({date:-1}).toArray()
        resolve(searchReport)
    })



}),


getUserCount:(()=>{
    return new Promise(async(resolve,reject)=>{
     let count=  await  db.get().collection(collection.USER_COLLECTION).count()
  
     if(count){
         resolve(count)
     }
     else{
         resolve(0)
     }
    })
}),

cartItemDelete:((proId,user)=>{


    return new Promise((resolve,reject)=>{

        db.get().collection(collection.CART_COLLECTION).updateOne({userID:user},{
           $pull:{"products":{"item":ObjectId(proId)}} 
        }).then(()=>{
            resolve()
        })


    })

}),

getCoupens:(()=>{
    return new Promise(async (resolve,reject)=>{
    let coupon =await db.get().collection(collection.COUPEN_COLLECTION).findOne()
    if(coupon){
        resolve(coupon)
    }
    else{
        reject("Not Found")
    }
   
    })
}),

getExtReferal:(()=>{
    return new Promise(async (resolve,reject)=>{
    let refer =await db.get().collection(collection.REFERAL_COLLECTION).findOne()
    if(refer){
        resolve(refer)
    }
    else{
        reject("Not Found")
    }
   
    })
}),



deleteCoupon:((id)=>{

    return new Promise(async (resolve,reject)=>{
   db.get().collection(collection.COUPEN_COLLECTION).deleteOne({_id:ObjectId(id)}).then(()=>{
       resolve()
   })
    
   
    })
}),


deleteReferal:((id)=>{

    return new Promise(async (resolve,reject)=>{
   db.get().collection(collection.REFERAL_COLLECTION).deleteOne({_id:ObjectId(id)}).then(()=>{
       resolve()
   })

   
    })
}),



}
