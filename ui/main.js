/*console.log('Loaded!');
var element=document.getElementById('main-text');
element.innerHTML='new value';

//move image

var img=document.getElementById('image');
var marginLeft=0;
function moveright (){
    marginLeft=marginLeft+10;
    img.style.marginLeft=marginLeft+'px';
}

img.onclick = function (){
    var interval=setInterval(moveright,100);
    
};*/




var button=document.getElementById('counter');

button.onclick = function(){
    //create request
    var request=new XMLHttpRequest();

    request.onreadystatechange=function(){
        if(request.readystate===XMLHttpRequest.DONE)
        {
            //do some actions
              if(request.status===200)
                {
                    var counter=request.responseText;
                    var span=document.getElementById('counts');
                    span.innerHTML=counter.toString();   
                }
        }
     };
    request.open('GET','http://sakshee-19.imad.hasura-app.io/counter',true);
    request.send(null);
};