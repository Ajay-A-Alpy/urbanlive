



    function validate(){
     var fname=document.getElementById('fname').value
     var lname=document.getElementById('lname').value
      var email=document.getElementById('email').value
       var number=document.getElementById('number').value
        var password=document.getElementById('password').value
        let  letters= /^[a-zA-Z ]*$/;
    

//first name
    
    if(fname==null){
    document.getElementById('fnamemsg').innerHTML=" **Name must be filled";
     document.form1.fname.focus();
     return false;
    }
    
    else {
      document.getElementById('fnamemsg').innerHTML="";
    }
    
    
    if(fname.length<4 ){
    document.getElementById('fnamemsg').innerHTML="**Enter a valid name";
     document.form1.fname.focus();
     return false;
    }
    else {
      document.getElementById('fnamemsg').innerHTML="";
    }
    
    
    if(fname.length>20 ){
    document.getElementById('fnamemsg').innerHTML="**Entered name is too long";
     document.form1.fname.focus();
     return false;
    }
    else {
      document.getElementById('fnamemsg').innerHTML="";
    }
    
    
    if(!isNaN(fname)){
    document.getElementById('fnamemsg').innerHTML="**Name must be character";
     document.form1.fname.focus();
     return false;
    }
    else {
      document.getElementById('fnamemsg').innerHTML="";
    }


    
    if(!(fname.match(letters))){
      document.getElementById('fnamemsg').innerHTML="**Name must be Alphabets";
       document.form1.fname.focus();
       return false;
      }
      else {
        document.getElementById('fnamemsg').innerHTML="";
      }

      //Last name

      
    if(lname==""){
    document.getElementById('lnamemsg').innerHTML=" Name must be filled";
     document.form1.lname.focus();
     return false;
    }
    
    else {
      document.getElementById('lnamemsg').innerHTML="";
    }


       
    if(!lname.match(letters)){
      document.getElementById('lnamemsg').innerHTML=" Name must be Alphabets";
       document.form1.lname.focus();
       return false;
      }
      
      else {
        document.getElementById('lnamemsg').innerHTML="";
      }
      
    
    
    
    
    if(email==""){
    document.getElementById('emailmsg').innerHTML="**E-mail must be filled";
     document.form1.email.focus();
     return false;
    }
    else {
      document.getElementById('emailmsg').innerHTML="";
    }
    
    
    if(email.indexOf('@')<=0){
    document.getElementById('emailmsg').innerHTML="** @ is position incorrect" ;
     document.form1.email.focus();
     return false;
    }
    else {
      document.getElementById('emailmsg').innerHTML="";
    }
    
    if(email.charAt(email.length-4)!="." && email.charAt(email.length-3)!="." ){
    document.getElementById('emailmsg').innerHTML="** Enter a valid E-mail" ;
     document.form1.email.focus();
     return false;
    }
    else {
      document.getElementById('emailmsg').innerHTML="";
    }
    
    //number checks
    if(number==""){
    document.getElementById('numbermsg').innerHTML="**Enter a Mobile Number";
     document.form1.number.focus();
     return false;
    }
    
    else {
      document.getElementById('numbermsg').innerHTML="";
    }
    
    
    if(isNaN(number)){
    document.getElementById('numbermsg').innerHTML="**Enter a valid  Mobile Number";
     document.form1.number.focus();
     return false;
    }
    else {
      document.getElementById('numbermsg').innerHTML="";
    }
    
    
    
    if(number.length!=10 ){
    document.getElementById('numbermsg').innerHTML="** Mobile Number must be 10 digits";
     document.form1.number.focus();
     return false;
    }
    else {
      document.getElementById('numbermsg').innerHTML="";
    }
    
    
    
    
    if(password==""){
    document.getElementById('passwordmsg').innerHTML="**Password must be filled";
     document.form1.password.focus();
     return false;
    }
    else {
      document.getElementById('passwordmsg').innerHTML="";
    }
    
    if(password.length<=4){
    document.getElementById('passwordmsg').innerHTML="**Password must be more than 4 characters";
     document.form1.password.focus();
     return false;
    }
    else {
      document.getElementById('passwordmsg').innerHTML="";
    }
    
    }
     
