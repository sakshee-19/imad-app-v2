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



var counter=0;
var button=document.getElementById('button');

button.onclick = function(){
counter=counter+1;
var span=document.getElementById('counts');
span.innerHTML=counter.toString();
};