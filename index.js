var p = document.getElementById("firstpass");
var butn = document.querySelector("button");

p.addEventListener('keyup',function(){ checkpass() });

function checkpass()
{
    var p = document.getElementById("firstpass").value;
    
     var m = document.getElementById("meter");
     var count = 0;
     if(p!="")
     {
        if(p.length >0 && p.length <= 7)
        {
             count = 1
        }
        if(p.length > 7 &&  p.length<=12)
        {
             count = 4
        }  
        if(p.length > 12 &&  p.length<=15)
        {
             count = 6
        }
        if(p.length > 15 &&  p.length<=20)
        {
             count = 9
        }
        
        
        if(count == 1 ){m.innerHTML="WEAK"; m.style.color="#ffffff";m.style.backgroundColor="rgb(39, 62, 63)";}
        if(count == 4 ){m.innerHTML="MODERATE";m.style.color="#B7B744";m.style.backgroundColor="rgb(39, 62, 63)"; }
        if(count == 6 ){m.innerHTML="GOOD"; m.style.color="#28A3EA"; m.style.backgroundColor="rgb(39, 62, 63)";}
        if(count == 9 ){m.innerHTML="VERY GOOD";m.style.color="#55EE1D";m.style.backgroundColor="rgb(39, 62, 63)"; }
        

     }
       var c = p.includes('password');
       var d = p.includes('word');
       var e = p.includes('pass');
       var l = document.getElementById("errormess");
     if(c||d||e)
     { 
          butn.disabled = true;
          l.innerHTML="Please donot use PASSWORD as password" 
      }
     else{ butn.disabled = false ;}
     
}

