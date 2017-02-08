var express = require('express');
var morgan = require('morgan');
var path = require('path');

var app = express();
app.use(morgan('combined'));

var articles={
    'article-one': {
        title:'Article One |sakshee jain',
        date:'19,july',
        heading:'Article One',
        content:`<p>
                This is my aricle one  This is my aricle one  This is my aricle one  This is my aricle one  This is my aricle one  This is my aricle one
           </p>
           <p>
                This is my aricle one  This is my aricle one  This is my aricle one This is my aricle one  This is my aricle one  This is my aricle one
           </p>
           <p>
                This is my aricle one  This is my aricle one  This is my aricle one This is my aricle one  This is my aricle one  This is my aricle one
           </p>`
    },
     'article-two': {
        title:'Article Two |sakshee jain',
        date:'19,july',
        heading:'Article two',
        content:` <p>
                This is my aricle two  This is my aricle two  This is my aricle two
           </p>
           <p>
                This is my aricle two  This is my aricle two  This is my aricle two
           </p>
           <p>
                This is my aricle two  This is my aricle two  This is my aricle two
           </p>`
    },
    'article-three': {
        title:'Article Three |sakshee jain',
        date:'19,july',
        heading:'Article Three',
        content:` <p>
                this is article three !!!!!!!!!!!!!!!!!!!!!!!!
            </p>
            
            <p>
                this is article three !!!!!!!!!!!!!!!!!!!!!!!!
            </p> `
    }
}
function CreateTemplate(data){
    var date=  data.date;
    var title=data.title;
    var content=data.content;
   var heading=data.heading;
    var htmlTemplate=`<html>
       <head>
           <title>
               ${title}     
               </title>
           <link href="/ui/style.css" rel="stylesheet" />
       </head> 
       <body>
           <div>
                <a  href="/">Home</a>
            </div>
            
            <div>
                <a  href="/article-two">Article two</a>
            </div>
       <hr/>
       
       <div class="container">
           <h3>
               ${heading}
           </h3>
           <div>
               ${date}
           </div>
           <div>
              ${content}
           </div>
       </div>
       </body>
    </html>`;
    return htmlTemplate;
}
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/:articlename', function (req, res) {
    var articlename=req.params.articlename;
  res.send(CreateTemplate(articles[articlename]));
});

app.get('/ui/main.js', function (req, res) {
     res.sendFile(path.join(__dirname,'ui','main.js'));
});




app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});


var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
