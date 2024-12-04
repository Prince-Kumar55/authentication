const express = require ('express');
const jwt = require('jsonwebtoken')
const JWT_SECRET = "randomprinceilovebabu"
const app = express();
const port = 3000;
app.use(express.json());

const users = [];

app.post("/signup", (req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    
    users.push({
        username: username,
        password: password
    })
    res.json({
        massage: "You are signed up"
    })
});
app.post ("/signin", (req,res)=>{
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

        res.json({
            token: token
        })
    } else {
        res.status(403).send({
            message: "Invalid username or password"
    })
}
});

app.get("/me", (req,res) => {
    const token = req.headers.token  // jwt
    const decodedinformation = jwt.verify(token, JWT_SECRET);
    const username = decodedinformation.username

    let foundUser = null;
    for (let i = 0; i < users.length; i++) {
        if (users[i].username == username) {
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


app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

