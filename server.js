var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool=require('pg').Pool;
var crypto=require('crypto');
var bodyParser=require('body-parser');
var session=require('express-session');

var config={
    user: 'sakshee-19',
    database: 'sakshee-19',
    host: 'db.imad.hasura-app.io',
    port: '5432',
    password: process.env.DB_PASSWORD 
};

var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(session({
    secret: 'somerandomSecretValue',
    cookie: {maxAge:60*1000*60*24*30 }
}));

var counter=0;
app.get('/counter',function(req,res){
  counter=counter+1;
  res.send(counter.toString());
});

/*static data
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
};*/

//dynamic data using database

var pool=new Pool(config);
app.get('/test-db',function(req,res){
    //make a select request 
    //response with results
    pool.query('SELECT * FROM test',function(err,results)
    {
        if(err){
            res.status(500).send(err.toString());
        }else{
            res.send(JSON.stringify(results.rows));
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

//function hash
function hash(input,salt){
    //how to create hash
    var hashed=crypto.pbkdf2Sync(input,salt,10000,512,'sha512');
    return ["pbkdf2","10000",salt,hashed.toString('hex')].join('$');
}

//hash input
app.get('/hash/:input',function(req,res){
   var hashedString=hash(req.params.input,'this-is-some-random-string'); 
   res.send(hashedString);
});

app.post('/create-user',function(req,res){
    //username
    //password
    //json request 
    var username=req.body.username;
    var password=req.body.password;
    
    var salt=crypto.randomBytes(128).toString('hex');
    var dbString=hash(password,salt);
    pool.query('INSERT INTO "user" (username,password) VALUES ($1,$2)',[username,dbString], function (err,result){
        if(err){
            res.status(500).send(err.toString());
        }
        else{
            res.send('user successfully created: ' + username);
        }
    });
});

app.post('/login',function(req,res){
    var username=req.body.username;
    var password=req.body.password;
    
    pool.query('SELECT * FROM "user" WHERE username= $1',[username], function (err,result){
        if(err){
            res.status(500).send(err.toString());
        }
        else{
            if(result.rows.length===0)
            {
                res.status(403).send('Invalid usernae/password');
            }else{
                var dbstring=result.rows[0].password;
                var salt=dbstring.split('$')[2];
                var hpassword=hash(password,salt);
                if(hpassword===dbstring){
                    //set the session
                    req.session.auth={userId: result.rows[0].id};
                    //set cookie with session id
                    //internally onserver side, it maps sessionid with object
                    // auth:{userid}
                    
                    
                    res.send('correct credential');
                }
                else{
                    res.status(403).send('Invalid username/Password');
                }
            }
        }     
    });
});

app.get('/check-login',function(req,res){
    if(req.session && req.session.auth && req.session.auth.userId)
    {
        res.send('You are logged in '+ req.session.auth.userId.toString());
    }else
    {
        res.send('You are not logged in');
    }
});

app.get('/logout',function(req,res){
   delete req.session.auth; 
   res.send('logout');
});
var names=[];
app.get('/submit-name',function(req,res){//url: submit-name?namexxxx this is query part so we can extract it like
    //get the names from request
    var name=req.query.name;
    names.push(name);
    //jason :
    res.send(JSON.stringify(names));
    
});

//to run server extracting content from database
app.get('/articles/:articlename', function (req, res) {
    pool.query("SELECT * FROM articles WHERE title= $1",[req.params.articlename],function(err,results) {
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
