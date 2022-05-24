var db=require('../config/connection')
var collection=require('../config/collection')
const { PRODUCT_COLLECTION } = require('../config/collection')
const async = require('hbs/lib/async')
const { ObjectId } = require('mongodb')
var objectId=require('mongodb').ObjectId


module.exports={

addProduct: (product,callback)=>{
db.get().collection('product').insertOne(product).then((data)=>{
    callback(data.insertedId)
   
})

},

getAllproduct:((from,nos)=>{

return new Promise( async (resolve,reject)=>{
    let products= await db.get().collection(collection.PRODUCT_COLLECTION).find().skip(from).limit(nos).toArray()
resolve(products)
})
}),







getCategoryPro:((name)=>{

    return new Promise( async (resolve,reject)=>{
        let products= await db.get().collection(collection.PRODUCT_COLLECTION).find({subcategory:name}).toArray()
        if(products.length){
            resolve(products)
        }
        else{
            resolve(0)
        }
  
    })
    }),


deleteProduct:((proId)=>{

   return new Promise((resolve,reject)=>{
    db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({_id:objectId(proId)}).then((response)=>{
        resolve(response)
    })

   })

}),

getProductInfo:((proId)=>{

return new Promise( async(resolve,reject)=>{
let product= await db.get().collection(collection.PRODUCT_COLLECTION).find({_id:objectId(proId)}).toArray()
resolve(product)

})


}),

updateProduct:((proId,proDetails)=>{
return new Promise((resolve,reject)=>{

    db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id:objectId(proId)},{$set:{
        pname:proDetails.pname,
        description:proDetails.description,
        description2:proDetails.description2,
         subcategory:proDetails.sub,
        price:proDetails.price,
        offer:proDetails.offer,
        discount:proDetails.discount,
        offerStatus:proDetails.offerStatus

    }}).then((response)=>{

        resolve(response)
    })

})

}),




addCategory: (main,sub ,callback)=>{
return new Promise((resolve,reject)=>{
    
    let category={
        name:main,
        sub:sub
    }
    db.get().collection(collection.CATEGORY_COLLECTION).insertOne(category).then(()=>{
     resolve()
       
    })


})
  
},

getAllCategory:( ()=>{
    return new Promise( async(resolve,reject)=>{
        let listCategory=  await db.get().collection(collection.CATEGORY_COLLECTION).find().toArray()
        resolve(listCategory)
    })
    }),

    getPlantCategory:( ()=>{
        return new Promise( async(resolve,reject)=>{
            let listCategory=  await db.get().collection(collection.CATEGORY_COLLECTION).find({name:"Plants"}).toArray()
            resolve(listCategory)
        })
        }),

        getPotCategory:( ()=>{
            return new Promise( async(resolve,reject)=>{
                let listCategory=  await db.get().collection(collection.CATEGORY_COLLECTION).find({name:"Pots"}).toArray()
                resolve(listCategory)
            })
            }),




getAllPotCategory:( ()=>{
    return new Promise( async(resolve,reject)=>{
        let listCategory=  await db.get().collection(collection.CATEGORY_COLLECTION).find({name:"Pots"}).toArray()
        resolve(listCategory)

    })

    }),


    getAllPlantCategory:( ()=>{
        return new Promise( async(resolve,reject)=>{
            let listCategory=  await db.get().collection(collection.CATEGORY_COLLECTION).find({name:"Plants"}).toArray()
            resolve(listCategory)
    
        })
    
        }),

    deleteCategory: ((categoryId) => {

        return new Promise((resolve, reject) => {
            db.get().collection(collection.CATEGORY_COLLECTION).deleteOne({ _id: ObjectId(categoryId) }).then((response) => {

                resolve(response)
            })

        })

    }),

    addCategoryOffer: ((offer, subcategory) => {

        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).updateMany({ subcategory: subcategory }, {
                $set: {
                    discount: offer
                }
            }).then(() => {
                db.get().collection(collection.CATEGORY_COLLECTION).updateOne({ sub: subcategory }, {
                    $set: {
                        offerValue: offer,
                        offerStart: new Date()
                    }
                }).then(() => {
                    resolve()
                })
            }
            )
        })
    }),

    getProductCount:(()=>{
        return new Promise(async(resolve,reject)=>{
         let count=  await  db.get().collection(collection.PRODUCT_COLLECTION).count()
     
         if(count){
             resolve(count)
         }
         else{
             resolve(0)
         }
        })
    }),

    getCategoryCount:(()=>{
        return new Promise(async(resolve,reject)=>{
         let count=  await  db.get().collection(collection.CATEGORY_COLLECTION).count()
  
         if(count){
             resolve(count)
         }
         else{
             resolve(0)
         }
        })
    }),

    saleTotal:
  (()=>{
        return new Promise(async(resolve,reject)=>{
         let count=  await  db.get().collection(collection.ORDER_COLLECTION).aggregate([
             {
                $match:{$or:[{status:"Shipped"},{status:"placed"}]}
             },
             {
                 $group:{
             _id:null,
            total: {$sum:{$toDouble:"$amount"}}
         }}]).toArray()
    
         if(count){                                                               
             resolve(count[0].total)
         }
         else{
             resolve(0)
         }
        })
    }),


    orderRangeTotal:
    ((start,end)=>{
          return new Promise(async(resolve,reject)=>{
           let count=  await  db.get().collection(collection.ORDER_COLLECTION).aggregate([
            {
                $match:{date: { $gte: start, $lte:end }}
            },

            {
                $match:{$or:[{status:"Shipped"},{status:"placed"}]}
             },
               
            {$group:{
               _id:null,
              total: {$sum:{$toDouble:"$amount"}}
           }}

        ]).toArray()
      
           if(count){                                                               
               resolve(count[0]?.total)
           }
           else{
               resolve(0)
           }
          })
      }),
  

      paymentTypeDetails:(()=>{
          return new Promise(async(resolve,reject)=>{
          let list= await  db.get().collection(collection.ORDER_COLLECTION).aggregate([
              {
                    $project:{paymentMethod:1}
              },
            {
                  $group:{_id:"$paymentMethod",
                    count:{$sum:1}
                }
            }
              ]).toArray()
        
              if(list){
                  resolve(list)
              }
              else{
                  reject("Not found")
              }
          })
        

       
      }),

    topProducts:(()=>{

        return new Promise( async (resolve,reject)=>{

     let topPro= await  db.get().collection(collection.ORDER_COLLECTION).aggregate([
                {
                    $unwind:"$products"
                },
                {
                   $project: {item:"$products.item",
                   quantity:"$products.quantity" }
                },
                {
                    $lookup:{
                        from: 'product',
                        localField: 'item',
                        foreignField: '_id',
                        as: 'product'

                    }
                },
                {
                    $project:{
                        item:1,
                        quantity:1,
                        product:{$arrayElemAt:["$product",0]}
                    }
                },
                {
                    $group:{_id:"$product.pname",

                  count:{$sum:1}}
                }
                ,
                {
                    $sort:{count:-1}
                }
            ]).toArray()

      
 
            resolve(topPro)

    
        })

        }),


        findPro:((itemId)=>{
            return new Promise(async(resolve,reject)=>{
                let item=  await  db.get().collection(collection.PRODUCT_COLLECTION).findOne({pname:itemId})
                resolve(item)
               })
        }),


        paymentTypeSale:(()=>{
            return new Promise(async(resolve,reject)=>{
            let list= await  db.get().collection(collection.ORDER_COLLECTION).aggregate([
                {
                    $match:{$or:[{status:"Shipped"},{status:"placed"}]}
                 },
            
              {
                    $group:{_id:"$paymentMethod",
                    total:{$sum:{$toDouble:"$amount"}}
                  }
              }
                ]).toArray()
             
                if(list){
                    resolve(list)
                }
                else{
                    reject("Not found")
                }
            })
          
  
         
        }),


getOrderCount:(()=>{
    return new Promise((resolve,reject)=>{
        let count= db.get().collection(collection.ORDER_COLLECTION).count()
        resolve(count)
    })
})
       





}