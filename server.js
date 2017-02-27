var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool=require('pg').Pool;

var config={
    user: 'sakshee-19',
    database: 'sakshee-19',
    host: 'db.imad.hasura-app.io',
    port: '5432',
    password: process.env.DB_PASSWORD 
    
    
};

var app = express();
app.use(morgan('combined'));


var counter=0;
app.get('/counter',function(req,res){
  counter=counter+1;
  res.send(counter.toString());
});




var articles={
    'article-one': {
        title:'Article One |sakshee jain',
        date:'july 19, 1996',
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
        date:'july 18, 1996',
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
        date:'july 17, 1996',
        heading:'Article Three',
        content:` <p>
                this is article three !!!!!!!!!!!!!!!!!!!!!!!!
            </p>
            
            <p>
                this is article three !!!!!!!!!!!!!!!!!!!!!!!!
            </p> `
    }
};


var pool=new Pool(config);
app.get('/test-db',function(req,res){
    //make a select request 
    //response with results
    pool.query('SELECT * FROM test',function(err,results)
    {
        if(err){
            res.status(500).send(err.toString());
        }else{
            res.send(JSON.stringify(results.row));
        }
    });
        
});

function CreateTemplate(data){
    
    var date=data.date;
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
               ${date.toDateString()}
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

var names=[];
app.get('/submit-name',function(req,res){//url: submit-name?namexxxx this is query part so we can extract it like
    //get the names from request
    var name=req.query.name;
    names.push(name);
    //jason :
    res.send(JSON.stringify(names));
    
});



app.get('/articles/:articlename', function (req, res) {
    
    
    pool.query("SELECT * FROM articles WHERE title= '"+req.params.articlename+"'",function(err,results) {
        if(err){
            res.status(500).send(err.toString());
        } else{
            if(results.rows.length===0){
                res.status(404).send('Not found any data');
            }else{
                var articleData=results.rows[0];
                res.send(CreateTemplate(articleData));
            }
        }
    });
  
});


app.get('/:articlename', function (req, res) {
    var articlename=req.params.articlename;
  res.send(CreateTemplate(articles[articlename]));
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
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
