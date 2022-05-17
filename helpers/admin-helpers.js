var db = require('../config/connection');
var collection = require('../config/collection');
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');
const async = require('hbs/lib/async');

module.exports={

doSignUp:((admin)=>{
    return new Promise(async(resolve,reject)=>{
        admin.password=await bcrypt.hash(admin.password,10)
        db.get().collection(collection.ADMIN_COLLECTION).insertOne(admin).then((data)=>{
            resolve(admin,data)
        })
    })
}),


doLogin:((emailId,secret)=>{
    return new Promise(async(resolve,reject)=>{
     
   let admin= await db.get().collection(collection.ADMIN_COLLECTION).findOne({email:emailId})
         if(admin){
             bcrypt.compare(secret,admin.password).then((status)=>{
                if(status){
                    resolve({status:true,data:admin})
                }

                else{
                    resolve({status:false})
                }

             })
         }
         else{
             resolve({status:false})
         }
    
    })
})





}