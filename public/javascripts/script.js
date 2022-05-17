

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
                    alert("payment failed")
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
let refresh=document.getElementById('refresh')
refresh.addEventListener('click',()=>{
    window.location.reload()
})


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

//multiple selections
