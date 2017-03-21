var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var mysql = require('mysql');
var clientPath = path.join(__dirname, '../client');

var pool = mysql.createPool({
    connectionLimit: 10, 
    host: 'localhost',
    user: 'blogUser',
    password: 'blog12678',
    database: 'AngularBlog'
});

var app = express();

app.use(express.static(clientPath));
app.use(bodyParser.json());

app.route('/api/posts')
    .get(function(req, res) {
        getAllPosts() 
            .then(function(posts) {
                res.send(posts);
            }, function(err) {
                res.status(500).send(err);
            });
    })
    .post(function(req, res) {
            var post = req.body;
                insertPost(post.content, post.userid, post.categoryid, post.title)
                .then(function(id) {
                    res.send(id);
                }, function(err) {
                    res.status(201).send(err);      
                });
    });

app.route('/api/posts/:id')
    .get(function(req, res) {
        getOnePost(req.params.id)
                .then(function(onePost) {
                    res.send(onePost);
                }, function(err) {
                    res.status(500).send(err);
                });
        })

    .put(function(req, res) {
            var post = req.body;
                updatePost(post.title, post.content, post.categoryid, req.params.id)
                .then(function() {
                    res.sendStatus(204);
                }, function(err) {
                    res.status(500).send(err);      
                });
    })
    .delete(function(req, res) {
            var post = req.params;
                deletePost(post.id)
                .then(function() {
                    res.sendStatus(204);
                }, function(err) {
                    res.status(500).send(err);      
                });
    });

app.route('/api/users')
    .get(function(req, res) {
        getUsers()
        .then(function(users) {
                res.send(users);
            }, function(err) {
                res.status(500).send(err);
            });
    });

app.route('/api/categories')
    .get(function(req, res) {
        getCategories()
        .then(function(categories){
                res.send(categories);
        }, function(err) {
            res.status(500).send(err);
        });       
    });

app.use(function (req, res, next) {
    if (isAsset(req.url)) {
        return next();
    } else {
        res.sendFile(path.join(clientPath, 'index.html'));
    }
});



  
app.listen(3000);

function getAllPosts() {
          return new Promise(function(resolve, reject){
                pool.getConnection(function(err, connection) {
                    if (err) {
                        reject(err);
                    } else {
                        connection.query('CALL get_allPosts();', function(err, allPosts) {
                            if (err) {
                                connection.release();
                                reject(err);
                            } else {
                                connection.release();
                                var results = allPosts[0];
                                resolve(results);
                            }
                        });
                    }
                });
            });
        }  

 function insertPost(pContent, pUserID, pCategoryId, pTitle) {
            return new Promise(function(resolve, reject){
                pool.getConnection(function(err, connection) {
                    if (err) {
                        reject(err);
                    } else {
                        connection.query('CALL insert_post(?,?,?,?);', [pContent, pUserID, pCategoryId, pTitle], function(err, resultsets) {
                            if (err) {
                                connection.release();
                                reject(err);
                            } else {
                                connection.release();
                                var results = resultsets[0];
                                resolve(results[0]);
                            }
                        });
                    }
                });
            });
        }

    function getOnePost(id) {
        return new Promise(function(resolve, reject){
                pool.getConnection(function(err, connection) {
                    if (err) {
                        reject(err);
                    } else {
                        connection.query('CALL get_onePost(?);', [id], function(err, onePost) {
                            if (err) {
                                connection.release();
                                reject(err);
                            } else {
                                connection.release();
                                var results = onePost[0];
                                resolve(results[0]);
                            }
                        });
                    }
                });
            });
        }  

    function updatePost(pTitle, pContent, pCategoryid, pId) {
            return new Promise(function(resolve, reject){
                pool.getConnection(function(err, connection) {
                    if (err) {
                        reject(err);
                    } else {
                        connection.query('CALL update_post(?,?,?,?);', [pTitle, pContent, pCategoryid, pId], function(err, resultsets) {
                            if (err) {
                                connection.release();
                                reject(err);
                            } else {
                                connection.release();                        
                                resolve();                               
                            }
                        });
                    }
                });
            });
        }

    function deletePost(pId) {
            return new Promise(function(resolve, reject) {
                    pool.getConnection(function(err, connection) {
                        if (err) {
                            reject(err);
                        } else {
                            connection.query('CALL delete_post(?);', [pId], function(err) {
                                if (err) {
                                    connection.release();
                                    reject(err);
                                } else {
                                    connection.release();
                                    resolve(); 
                                }
                            });
                        }
                    });
                });
            }

    function getUsers() {
          return new Promise(function(resolve, reject){
                pool.getConnection(function(err, connection) {
                    if (err) {
                        reject(err);
                    } else {
                        connection.query('CALL get_users();', function(err, allUsers) {
                            if (err) {
                                connection.release();
                                reject(err);
                            } else {
                                connection.release();
                                var results = allUsers[0];
                                resolve(results);
                            }
                        });
                    }
                });
            });
        }   
    
    function getCategories() {
          return new Promise(function(resolve, reject){
                pool.getConnection(function(err, connection) {
                    if (err) {
                        reject(err);
                    } else {
                        connection.query('CALL get_categories();', function(err, allCategories) {
                            if (err) {
                                connection.release();
                                reject(err);
                            } else {
                                connection.release();
                                var results = allCategories[0];
                                resolve(results);
                            }
                        });
                    }
                });
            });
        }  

    function isAsset(path) {
    var pieces = path.split('/');
    if (pieces.length === 0) {
        return false;
    }
    var lastPiece = pieces[pieces.length - 1];
    if (path.indexOf('/api') !== -1 || path.indexOf('/?') !== -1) {
        return true;
    } else if (lastPiece.indexOf('.') !== -1) {
        return true;
    } else {
        return false;
    }
}