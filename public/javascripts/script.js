'use strict'

function addToCart(proId){

    $.ajax({
            url:"/add-to-cart/"+ proId,
            method:"get" ,
            success:(response)=>{
                console.log(response)
               if(response.status){
                   let count=$('#cart-count').html()
                   count=parseInt(count)+1;
                   $('#cart-count').html(count);
               }
            }
    })
}

function changeQuantity(cartId,proId,count,userId){
let quantity=parseInt(document.getElementById(proId).innerHTML)
count=parseInt(count)

$.ajax({
            url:"/change-product-quantity",
            data:{
                User:userId,
                cart:cartId,
                product:proId,
                count:count,
                qty:quantity
            
            },

            method:'post',
            success:(response)=>{
                if(response.removeProduct){
                    alert("Product removed from cart")
                    location.reload()
                }

                else{
                  
                    document.getElementById(proId).innerHTML= quantity+count;
                    document.getElementById('total').innerHTML=response.total;
                }
   
            }

})

}


$("#checkout-form").submit((e) => {
    e.preventDefault()
    $.ajax({
        url:'/place-order',
        method: "post",
    data:$("#checkout-form").serialize() ,
    success: (response) => {
            if (response.codStatus) {
                location.href = '/order-success'
            }
            else if(response.paypal){
                location.href=response.url;
            }
            else {
                razorpayPayment(response)
            }
        }

    })
       })

       


    function razorpayPayment(order) {
        var options = {
            "key": "rzp_test_5NptZpN5Kc2ev0",
            "amount": order.amount*100,
            "currency": "INR",
            "name": "Urban Plants",
            "description": "Test Transaction",
            "image": "",
            "order_id": order.id,
            "handler": function (response) {
                // alert(response.razorpay_payment_id);
                // alert(response.razorpay_order_id);
                // alert(response.razorpay_signature);

                verifyPayment(response, order)
            },
            "theme": {
                "color": "#3399cc"
            }
        }
        var rzp1 = new Razorpay(options);
        rzp1.open();
    }
           
function verifyPayment(payment, order) {
        $.ajax({
            url: '/verify-payment',
            method: "post",
            data: {
                payment,
                order
            },
         
            success:(response)=>{
                if(response.status){
                    location.href = '/order-success'
                }
                else{
                    location.href = '/cancel'
                }


            }
        })
    }

//check-box selection 
    $('input[type="checkbox"]').on('change', function() {
        $('input[type="checkbox"]').not(this).prop('checked', false);
     });

    
     function applyOffer(){
        $.ajax({
                url:"/apply-referal",
                method:"get" ,
                success:(response)=>{
                   if(response.status){
                    location.href = '/place-order'
                    
                     
                   }
                }
        })
    }
      
// for address selection checkbox
$(document).ready(function () {
    $('#checkBtn').click(function() {
      checked = $("input[type=checkbox]:checked").length;

      if(!checked) {
        swal ( "Oops","Address not selected !","warning")

        return false;
      }

    });
});

//back-button
let bckBtn=document.getElementById('back')
bckBtn.addEventListener('click',()=>{
    window.history.back()
})

//refersh button
// let refresh=document.getElementById('refresh')
// refresh.addEventListener('click',()=>{
//     window.location.reload()
// })


function cartItemDelete(proId){
    $.ajax({
            url:"/cartItemDelete/"+proId,
            method:"get" ,
            success:(response)=>{
               if(response.status){
                location.href = '/view-cart'
                
                 
               }
            }
    })
}

function deleteCoupon(Id){
    $.ajax({
            url:"/admin/deleteCoupon/"+Id,
            method:"get" ,
            success:(response)=>{
               if(response.status){
                location.href = '/admin/coupens'
                
               }
            }
    })
}

function deleteReferal(Id){
    $.ajax({
            url:"/admin/deleteReferal/"+Id,
            method:"get" ,
            success:(response)=>{
               if(response.status){
                location.href = '/admin/referal-offer'
                
               }
            }
    })
}

 function validateLog (){

    var email=document.getElementById('email').value
     var password=document.getElementById('password').value
  if(email==""){
    document.getElementById('emailmsg').innerHTML="**E-mail must be filled";
     document.form2.email.focus();
     return false;
    }
    else {
      document.getElementById('emailmsg').innerHTML="";
    }
    
    
    if(email.indexOf('@')<=0){
    document.getElementById('emailmsg').innerHTML="** @ is position incorrect" ;
     document.form2.email.focus();
     return false;
    }
    else {
      document.getElementById('emailmsg').innerHTML="";
    }
    
    if(email.charAt(email.length-4)!="." && email.charAt(email.length-3)!="." ){
    document.getElementById('emailmsg').innerHTML="** Enter a valid E-mail" ;
     document.form2.email.focus();
     return false;
    }
    else {
      document.getElementById('emailmsg').innerHTML="";
    }

  if(password==""){
    document.getElementById('passwordmsg').innerHTML="**Password must be filled";
     document.form2.password.focus();
     return false;
    }
    else {
      document.getElementById('passwordmsg').innerHTML="";
    }
    
    if(password.length<=4){
    document.getElementById('passwordmsg').innerHTML="**Password must be more than 4 characters";
     document.form2.password.focus();
     return false;
    }
    else {
      document.getElementById('passwordmsg').innerHTML="";
    }

    return true

  }

  function deleteItem(){
  

    swal({
    
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this imaginary file!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
          swal("Poof! Your imaginary file has been deleted!", {
            icon: "success",})
            return true
          
          
        } else {
          swal("Your imaginary file is safe!");
        return false
        }
      });

      return false
      

  }

  function validateCateg(){
    var name=document.getElementById('sub').value
    
    let  letters= /^[a-zA-Z ]*$/;

    if(name==""){
        document.getElementById('submsg').innerHTML="Name required"
        document.AddCateg.sub.focus();
        return false 
    }
    else{
      document.getElementById('submsg').innerHTML=""
    }

    if(name.length <=3 ){
        document.getElementById('submsg').innerHTML="Name too short"
        document.AddCateg.sub.focus();
        return false 
    }
    else{
      document.getElementById('submsg').innerHTML=""
    }

    if(!name?.match(letters)){
        document.getElementById('submsg').innerHTML="Name must be Alphabets";
         document.AddCateg.sub.focus();
         return false;
        }
        else {
          document.getElementById('submsg').innerHTML="";
        }

        return true;
  }

   function validateCoupon(){

    var code = document.getElementById('code').value;
    var disc= document.getElementById('discount').value;
    let  letters= /^[a-zA-Z0-9 ]*$/;
    let  nums= /^[0-9]*$/;

    if (code ==""){
        document.getElementById('codemsg').innerHTML= "Code required";
        document.AddCoupon.code.focus();
        return false;
    }
    else{
        document.getElementById('codemsg').innerHTML= "";
    }

    if (!code.match(letters)){
        document.getElementById('codemsg').innerHTML= "Must be Alphanumerals"
        document.AddCoupon.code.focus()
        return false;
    }
    else{
        document.getElementById('codemsg').innerHTML= ""
    }


    if (disc ==""){
        document.getElementById('discmsg').innerHTML= "value required";
        document.AddCoupon.discount.focus();
        return false;
    }
    else{
        document.getElementById('discmsg').innerHTML= "";
    }

    if (!disc.match(nums)){
        document.getElementById('discmsg').innerHTML= "Only Numbers allowed";
        document.AddCoupon.discount.focus();
        return false;
    }
    else{
        document.getElementById('discmsg').innerHTML= "";
    }



return true;
   }

   function validateRef(){
    var disc=document.getElementById('discount').value
    let  nums= /^[0-9]*$/;
    if (disc ==""){
        document.getElementById('discmsg').innerHTML= "value required";
        document.AddRef.discount.focus();
        return false;
    }
    else{
        document.getElementById('discmsg').innerHTML= "";
    }
    if (!disc.match(nums)){
        document.getElementById('discmsg').innerHTML= "Only Numbers allowed";
        document.AddRef.discount.focus();
        return false;
    }
    else{
        document.getElementById('discmsg').innerHTML= "";
    }
return true;
   }


   


  const  validateAddPro=()=>{
      var name=document.getElementById('pname').value
      var des1=document.getElementById('description').value
      var des2=document.getElementById('description2').value
      var price=document.getElementById('price').value
      var offer=document.getElementById('offer').value
      var img=document.getElementById('image').files.length


      let  letters= /^[a-zA-Z ]*$/;

      if(name==""){
          document.getElementById('pnamemsg').innerHTML="Name must Enter"
          document.AddPro.pname.focus();
          return false 
      }
      else{
        document.getElementById('pnamemsg').innerHTML=""
      }

     

      if(!name?.match(letters)){
        document.getElementById('pnamemsg').innerHTML="**Name must be Alphabets";
         document.AddPro.pname.focus();
         return false;
        }
        else {
          document.getElementById('pnamemsg').innerHTML="";
        }


//description1
        
   
            if(des1==""){
                document.getElementById('des1msg').innerHTML="Field cannot empty"
                document.AddPro.description.focus();
                return false 
            }
            else{
            document.getElementById('des1msg').innerHTML=""
            }

      if(des1.length <= 10){
        document.getElementById('des1msg').innerHTML="Must have at least 10 characters"
        document.AddPro.description.focus();
        return false 
    }
    else{
      document.getElementById('des1msg').innerHTML=""
    }

   

   //description2
   if(des2.length==""){
    document.getElementById('des2msg').innerHTML="Field cannot empty"
    document.AddPro.description2.focus();
    return false 
}
else{
  document.getElementById('des2msg').innerHTML=""
}


    if(des2.length <=20){
        document.getElementById('des2msg').innerHTML="Must have at least 20 characters"
        document.AddPro.description2.focus();
        return false 
    }
    else{
      document.getElementById('des2msg').innerHTML=""
    }

      
//price
if(price==""){
    document.getElementById('pricemsg').innerHTML="Price must Enter"
    document.AddPro.price.focus();
    return false 
}
else{
  document.getElementById('pricemsg').innerHTML=""
}

if(price==0){
    document.getElementById('pricemsg').innerHTML="Not a valid Price"
    document.AddPro.price.focus();
    return false 
}
else{
  document.getElementById('pricemsg').innerHTML=""
}
//offer
if(offer==""){
    document.getElementById('offermsg').innerHTML="Field Required";
    document.AddPro.offer.focus();
    return false 
}
else{
  document.getElementById('offermsg').innerHTML=""
}


if(!offer.match(letters)){
    document.getElementById('offermsg').innerHTML="Must Enter Alphanumerals"
    document.AddPro.offer.focus();
    return false 
}
else{
  document.getElementById('offermsg').innerHTML=""
}

//image


if(img===0){
    document.getElementById('imgmsg').innerHTML="Image Required"
    document.AddPro.image.focus();
    return false 
}
else{
  document.getElementById('imgmsg').innerHTML="";
}
      return true;

  }

  const  validateEditPro=()=>{
    var name=document.getElementById('pname').value
    var des1=document.getElementById('description').value
    var des2=document.getElementById('description2').value
    var price=document.getElementById('price').value
    var offer=document.getElementById('offer').value
 
    let  letters= /^[a-zA-Z ]*$/;
    if(name==""){
        document.getElementById('pnamemsg').innerHTML="Name must Enter"
        document.AddPro.pname.focus();
        return false 
    }
    else{
      document.getElementById('pnamemsg').innerHTML=""
    }

    if(!name?.match(letters)){
      document.getElementById('pnamemsg').innerHTML="**Name must be Alphabets";
       document.AddPro.pname.focus();
       return false;
      }
      else {
        document.getElementById('pnamemsg').innerHTML="";
      }

//description1
          if(des1==""){
              document.getElementById('des1msg').innerHTML="Field cannot empty"
              document.AddPro.description.focus();
              return false 
          }
          else{
          document.getElementById('des1msg').innerHTML=""
          }

    if(des1.length <= 10){
      document.getElementById('des1msg').innerHTML="Must have at least 10 characters"
      document.AddPro.description.focus();
      return false 
  }
  else{
    document.getElementById('des1msg').innerHTML=""
  }

 

 //description2
 if(des2.length==""){
  document.getElementById('des2msg').innerHTML="Field cannot empty"
  document.AddPro.description2.focus();
  return false 
}
else{
document.getElementById('des2msg').innerHTML=""
}


  if(des2.length <=20){
      document.getElementById('des2msg').innerHTML="Must have at least 20 characters"
      document.AddPro.description2.focus();
      return false 
  }
  else{
    document.getElementById('des2msg').innerHTML=""
  }

    
//price
if(price==""){
  document.getElementById('pricemsg').innerHTML="Price must Enter"
  document.AddPro.price.focus();
  return false 
}
else{
document.getElementById('pricemsg').innerHTML=""
}

if(price==0){
  document.getElementById('pricemsg').innerHTML="Not a valid Price"
  document.AddPro.price.focus();
  return false 
}
else{
document.getElementById('pricemsg').innerHTML=""
}
//offer
if(offer==""){
  document.getElementById('offermsg').innerHTML="Field Required";
  document.AddPro.offer.focus();
  return false 
}
else{
document.getElementById('offermsg').innerHTML=""
}


if(!offer.match(letters)){
  document.getElementById('offermsg').innerHTML="Must Enter Alphanumerals"
  document.AddPro.offer.focus();
  return false 
}
else{
document.getElementById('offermsg').innerHTML=""
}

//image



    return true;

}





function validateAddress(){
    var name=document.getElementById('name').value
    var mobile=document.getElementById('mobile').value
    var address=document.getElementById('address').value
    var city=document.getElementById('city').value
    var state=document.getElementById('state').value
    var pincode=document.getElementById('pincode').value
    var landmark=document.getElementById('landmark').value

    let  letters= /^[a-zA-Z ]*$/;
    let  alphaNums= /^[a-zA-Z0-9  ]*$/;
    let  nums= /^[0-9]*$/;

    if(name==""||name.length <3 ){
        document.getElementById('namemsg').innerHTML="Invalid Name"
        document.addressForm.name.focus();
        return false 
    }
    else{
      document.getElementById('namemsg').innerHTML=""
    }

    if(!name?.match(letters)){
      document.getElementById('namemsg').innerHTML="**Name must be Alphabets";
      document.addressForm.name.focus();
       return false;
      }
      else {
        document.getElementById('namemsg').innerHTML="";
      }


         
 //address
 if(address.length==""){
  document.getElementById('addmsg').innerHTML="Field reuired"
  document.addressForm.address.focus();
  return false 
}
else{
document.getElementById('addmsg').innerHTML=""
}


  if(address.length <=4 ){
      document.getElementById('addmsg').innerHTML="Must have at least 4 characters"
      document.addressForm.address.focus();
      return false 
  }
  else{
    document.getElementById('addmsg').innerHTML=""
  }



  if(!address.match(alphaNums)){
    document.getElementById('addmsg').innerHTML="Special characters not valid";
    document.addressForm.address.focus();
     return false;
    }
    else {
      document.getElementById('addmsg').innerHTML="";
    }


  //city
  if(city.length==""){
    document.getElementById('citymsg').innerHTML="Field reuired"
    document.addressForm.city.focus();
    return false 
  }
  else{
  document.getElementById('citymsg').innerHTML=""
  }
  
  
    if(city.length <=4){
        document.getElementById('citymsg').innerHTML="Must have at least 4 characters"
        document.addressForm.city.focus();
        return false 
    }
    else{
      document.getElementById('citymsg').innerHTML=""
    }


    if(!city.match(letters)){
        document.getElementById('citymsg').innerHTML="must be Alphabets"
        document.addressForm.city.focus();
        return false 
    }
    else{
      document.getElementById('citymsg').innerHTML=""
    }
    
//state
if(state.length==""){
    document.getElementById('statemsg').innerHTML="Field reuired"
    document.addressForm.state.focus();
    return false 
  }
  else{
  document.getElementById('statemsg').innerHTML=statemsg
  }
  
    if(state.length <=4){
        document.getElementById('statemsg').innerHTML="Must have at least 4 characters"
        document.addressForm.state.focus();
        return false 
    }
    else{
      document.getElementById('statemsg').innerHTML=""
    }

    if(!state.match(letters)){
        document.getElementById('statemsg').innerHTML="Must be Alphabets"
        document.addressForm.state.focus();
        return false 
    }
    else{
      document.getElementById('statemsg').innerHTML=""
    }

    //landmark
    if(landmark.length==""){
        document.getElementById('landmsg').innerHTML="Field reuired"
        document.addressForm.landmark.focus();
        return false 
      }
      else{
      document.getElementById('landmsg').innerHTML=statemsg
      }
      
        if(landmark.length <=6){
            document.getElementById('landmsg').innerHTML="Must have at least 6 characters"
            document.addressForm.landmark.focus();
            return false 
        }
        else{
          document.getElementById('landmsg').innerHTML=""
        }


        if(!landmark.match(alphaNums)){
            document.getElementById('landmsg').innerHTML="Special characters are not allowed"
            document.addressForm.landmark.focus();
            return false 
        }
        else{
          document.getElementById('landmsg').innerHTML=""
        }



//mobile
if(mobile==""){
  document.getElementById('mobmsg').innerHTML="Number must Enter"
  document.addressForm.mobile.focus();
  return false 
}
else{
document.getElementById('mobmsg').innerHTML=""
}

if(mobile.length != 10){
  document.getElementById('mobmsg').innerHTML="Number Must be 10 digits"
  document.addressForm.mobile.focus();
  return false 
}
else{
document.getElementById('mobmsg').innerHTML=""
}


if(!mobile.match(nums)){
    document.getElementById('mobmsg').innerHTML="Must be digits"
    document.addressForm.mobile.focus();
    return false 
  }
  else{
  document.getElementById('mobmsg').innerHTML=""
  }

//pincode
if(pincode==""){
    document.getElementById('pinmsg').innerHTML="Required"
    document.addressForm.pincode.focus();
    return false 
  }
  else{
  document.getElementById('pinmsg').innerHTML=""
  }
  
  if(pincode.length != 6){
    document.getElementById('pinmsg').innerHTML=" Must be 6 digits"
    document.addressForm.pincode.focus();
    return false 
  }
  else{
  document.getElementById('pinmsg').innerHTML=""
  }

  if(!pincode.matches(nums)){
    document.getElementById('pinmsg').innerHTML=" Must be digits"
    document.addressForm.pincode.focus();
    return false 
  }
  else{
  document.getElementById('pinmsg').innerHTML=""
  }

    return true;

}


   
function validateProfile(){

    var fname=document.getElementById('fname').value
    var lname=document.getElementById('lname').value
    var email=document.getElementById('email').value
    var mobile=document.getElementById('number').value
  
    var address=document.getElementById('address').value
    var place=document.getElementById('place').value
    var district=document.getElementById('district').value
    var pincode=document.getElementById('pincode').value
  
  
    let  letters= /^[a-zA-Z ]*$/;
    let  alphaNums= /^[a-zA-Z0-9  ]*$/;
    let  nums= /^[0-9]*$/;
  
    if(fname==""||fname.length <3 ){
        document.getElementById('fnamemsg').innerHTML="Invalid Name"
        document.addressForm.fname.focus();
        return false 
    }
    else{
      document.getElementById('fnamemsg').innerHTML=""
    }
  
    if(!fname?.match(letters)){
      document.getElementById('fnamemsg').innerHTML="**Name must be Alphabets";
      document.addressForm.fname.focus();
       return false;
      }
      else {
        document.getElementById('fnamemsg').innerHTML="";
      }
  
  
      //last name
      
    if(lname==""||lname.length <3 ){
      document.getElementById('lnamemsg').innerHTML="Invalid Name"
      document.addressForm.lname.focus();
      return false 
  }
  else{
    document.getElementById('lnamemsg').innerHTML=""
  }
  
  if(!lname?.match(letters)){
    document.getElementById('lnamemsg').innerHTML="**Name must be Alphabets";
    document.addressForm.lname.focus();
     return false;
    }
    else {
      document.getElementById('lnamemsg').innerHTML="";
    }
  
  //email
  if(email==""){
    document.getElementById('emailmsg').innerHTML="**E-mail must be filled";
     document.addressForm.email.focus();
     return false;
    }
    else {
      document.getElementById('emailmsg').innerHTML="";
    }
    
    
    if(email.indexOf('@')<=0){
    document.getElementById('emailmsg').innerHTML="** @ is position incorrect" ;
     document.addressForm.email.focus();
     return false;
    }
    else {
      document.getElementById('emailmsg').innerHTML="";
    }
    
    if(email.charAt(email.length-4)!="." && email.charAt(email.length-3)!="." ){
    document.getElementById('emailmsg').innerHTML="** Enter a valid E-mail" ;
     document.addressForm.email.focus();
     return false;
    }
    else {
      document.getElementById('emailmsg').innerHTML="";
    }
         
  //address
  if(address.length==""){
  document.getElementById('addmsg').innerHTML="Field reuired"
  document.addressForm.address.focus();
  return false 
  }
  else{
  document.getElementById('addmsg').innerHTML=""
  }
  
  
  if(address.length <=4 ){
      document.getElementById('addmsg').innerHTML="Must have at least 4 characters"
      document.addressForm.address.focus();
      return false 
  }
  else{
    document.getElementById('addmsg').innerHTML=""
  }
  
  
  
  if(!address.match(alphaNums)){
    document.getElementById('addmsg').innerHTML="Special characters not valid";
    document.addressForm.address.focus();
     return false;
    }
    else {
      document.getElementById('addmsg').innerHTML="";
    }
  
  
  //place
  if(place.length==""){
    document.getElementById('placemsg').innerHTML="Field reuired"
    document.addressForm.place.focus();
    return false 
  }
  else{
  document.getElementById('placemsg').innerHTML=""
  }
  
  
    if(place.length <=4){
        document.getElementById('placemsg').innerHTML="Must have at least 4 characters"
        document.addressForm.place.focus();
        return false 
    }
    else{
      document.getElementById('placemsg').innerHTML=""
    }
  
  
    if(!place.match(letters)){
        document.getElementById('placemsg').innerHTML="must be Alphabets"
        document.addressForm.place.focus();
        return false 
    }
    else{
      document.getElementById('placemsg').innerHTML=""
    }
    
  //district
  if(district.length==""){
    document.getElementById('distmsg').innerHTML="Field reuired"
    document.addressForm.district.focus();
    return false 
  }
  else{
  document.getElementById('distmsg').innerHTML=""
  }
  
    if(district.length <=4){
        document.getElementById('distmsg').innerHTML="Must have at least 4 characters"
        document.addressForm.district.focus();
        return false 
    }
    else{
      document.getElementById('distmsg').innerHTML=""
    }
  
    if(!district.match(letters)){
        document.getElementById('distmsg').innerHTML="Must be Alphabets"
        document.addressForm.district.focus();
        return false 
    }
    else{
      document.getElementById('distmsg').innerHTML=""
    }
  
    //landmark
    
  
  
  //mobile
  if(mobile==""){
  document.getElementById('mobmsg').innerHTML="Number must Enter"
  document.addressForm.number.focus();
  return false 
  }
  else{
  document.getElementById('mobmsg').innerHTML=""
  }
  
  if(mobile.length != 10){
  document.getElementById('mobmsg').innerHTML="Number Must be 10 digits"
  document.addressForm.number.focus();
  return false 
  }
  else{
  document.getElementById('mobmsg').innerHTML=""
  }
  
  
  if(!mobile.match(nums)){
    document.getElementById('mobmsg').innerHTML="Must be digits"
    document.addressForm.number.focus();
    return false 
  }
  else{
  document.getElementById('mobmsg').innerHTML=""
  }
  
  //pincode
  if(pincode==""){
    document.getElementById('pinmsg').innerHTML="Required"
    document.addressForm.pincode.focus();
    return false 
  }
  else{
  document.getElementById('pinmsg').innerHTML=""
  }
  
  if(pincode.length != 6){
    document.getElementById('pinmsg').innerHTML=" Must be 6 digits"
    document.addressForm.pincode.focus();
    return false 
  }
  else{
  document.getElementById('pinmsg').innerHTML=""
  }
  
  if(!pincode.match(nums)){
    document.getElementById('pinmsg').innerHTML=" Must be digits"
    document.addressForm.pincode.focus();
    return false 
  }
  else{
  document.getElementById('pinmsg').innerHTML=""
  }
  
    return true;
  
  }