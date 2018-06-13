var express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    cons = require('consolidate'),
    dust = require('dustjs-helpers'),
    pg = require('pg'),
    app = express();

    // DB Connect String
    var config = {
        user: 'Jwsummers',
        database: 'recipeBookDB', 
        password: '123456', 
        port: 5432, 
        max: 10, // max number of connection can be open to database
        idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
      };
    const pool = new pg.Pool(config);

    // Assign Dust Engine to .dust Files
    app.engine('dust', cons.dust);

    // Set Default Ext .dust
    app.set('view engine', 'dust');
    app.set('views', __dirname + '/views');
    
    // Set Public Folder
    app.use(express.static(path.join(__dirname, 'public')));

    // Body Parser Middleware
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    app.get('/', function(req, res){
        //PG Connect
        pool.connect(function(err, client, done) {
            if(err) {
                return console.error('error fetching client from pool', err);
            }
            client.query('Select * FROM recipes', function(err, result) {
                if(err) {
                    return console.error('error running query', err);
                }
                res.render('index', {recipes: result.rows});
                done();
            });
        });     
    });
    
    // Server
    app.listen(3000, function() {
        console.log('Server Started On Port 3000');
    });