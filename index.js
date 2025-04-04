const express = require ('express');
const jwt = require('jsonwebtoken')
const JWT_SECRET = "randomprinceilovebabu"
const app = express();
const port = 3000;
app.use(express.json());

const users = [];

function logger(req, res, next) {
    console.log(req.method + " request came " );
    next();
};

app.get("/", function(req,res){ 
    res.sendFile(__dirname + "/Public/index.html")
});

app.post("/signup", logger,(req,res)=>{
    const {username,password} = req.body;
    
    users.push({
        username: username,
        password: password
    })
    res.json({
        massage: "You are signed up"
    })
}); 
app.post ("/signin", logger,  (req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    
    let founduser = null;
    for (let i= 0; i<users.length; i++){
    if (users[i].username == username && users[i].password == password){
        founduser = users[i];
    }}

    if (founduser) {

        const token = jwt.sign({
            username: username
        },JWT_SECRET ); // convert their username over to a jwt

       // founduser.token = token;

        res.status(200).json({
            token: token
        })
    } else {
        res.status(403).send({
            message: "Invalid username or password"
    })
}
});

function auth(req, res, next) {
    const {token} = req.headers;
    const decodedData  = jwt.verify(token, JWT_SECRET);

    if(decodedData.username){
        req.username = decodedData.username;    
        next();
    }else{
        res.json({
        massage: "you are not logged in"
            })
        }; 
}

app.get("/me", logger ,auth, (req,res) => {

    let foundUser = null;

    for (let i = 0; i < users.length; i++) {
        if (users[i].username === req.username) {
            foundUser = users[i] 
        }
    }

    if (foundUser) {
        res.json({
            username: foundUser.username,
            password: foundUser.password 
        })
    } else {
        res.json({
            massage: "Token Invalid"
        })
    }
})

app.get("/todo", auth, function(req,res) {

})

app.post("/todo", auth, function(req,res) {

})

app.delete("/todo", auth, function(req,res) {

})

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

