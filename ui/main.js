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


/*

var button=document.getElementById('counter');

button.onclick = function(){
    //create request
    var request=new XMLHttpRequest();

    request.onreadystatechange=function(){
        if(request.readyState===XMLHttpRequest.DONE)
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

*/

//Submit Button
//subit username/password to login

var submit=document.getElementById('submit_btn');
submit.onclick = function(){
  
  //make request to the server send the name
   var request=new XMLHttpRequest();

    request.onreadystatechange=function(){
        if(request.readyState===XMLHttpRequest.DONE)
        {
            //do some actions
              if(request.status===200)
                {
                        //capture the list and update
                      var names=request.responseText;
                      names=JSON.parse(names);
                      var list='';
                      for(var i=0; i<names.length ; i++){
                          list += '<li>'+names[i]+'</li>';
                      }
                      var ul=document.getElementById('namelist');
                      ul.innerHTML=list; 
                }
        }
     };
    // var nameInput=document.getElementById('name');
     //var name=nameInput.value;
     var username=document.getElementById('username').value;
     var password=document.getElementById('password').value;
     console.log('username');
     console.log('password');
     request.open('POST','http://sakshee-19.imad.hasura-app.io/submit-name?name='+ name,true);
     //request.send(null);
     request.send(JSON.stringify({username: username ,password: password}));
};