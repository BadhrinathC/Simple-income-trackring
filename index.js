var p = document.getElementById("firstpass");
var butn = document.getElementById("logsubmit");

p.addEventListener('keyup',function(){ checkpass() });

function checkpass()
{
    var p = document.getElementById("firstpass").value;
    
     var m = document.getElementById("meter");
     var count = 0;
     if(p!="")
     {
        if(p.length >0 && p.length < 6)
        {
             count = 1
        }
        if(p.length > 6 &&  p.length<=10)
        {
             count = 4
        }  
        if(p.length > 10 &&  p.length<=13)
        {
             count = 6
        }
        if(p.length > 13 &&  p.length<=19)
        {
             count = 9
        }
        if(p.length > 19 && p.length <=23 )
        {
             count = 10
        }
        if(p.length > 24)
        {
          count = 20
        }
        
        
        if(count == 1 ){m.innerHTML="You're doing good"; m.style.color="#141414 ";m.style.backgroundColor="#ec7f37";}
        if(count == 4 ){m.innerHTML="Please Keep going";m.style.color="#141414 ";m.style.backgroundColor="#ec7f37"; }
        if(count == 6 ){m.innerHTML="Great that"; m.style.color="#141414 "; m.style.backgroundColor="#ec7f37";}
        if(count == 9 ){m.innerHTML="Awesome, youre still going";m.style.color="#141414 ";m.style.backgroundColor="#ec7f37 "; }
        if(count == 10 ){m.innerHTML="Make sure you remember this ";m.style.color="##141414 ";m.style.backgroundColor="#ec7f37 "; }
        if(count == 20){m.innerHTML="Thats the end , go create your account";m.style.color="#141414 ";m.style.backgroundColor="#ec7f37 "; }
        

     }
     else{m.innerHTML="";m.style.backgroundColor="#393939"}

     
     var d = p.includes('word');
     var e = p.includes('pass');
     var c = p.includes('password');
     var l = document.getElementById("errormess");
   if(p.length == 0)
   {
     l.innerHTML="" 
   }  
   if(c||d||e)
   { 
        butn.disabled = true;
        l.innerHTML="Please donot use PASSWORD as password" 
    }
   else{ butn.disabled = false ;}
   

       
     
}
