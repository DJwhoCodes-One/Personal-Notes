require('dotenv').config();
const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const userModel = require('./models/user.model');
const postModel = require('./models/post.model');

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.render('index');
})

app.post('/register', async (req, res) => {
    const { username, name, age, email, password } = req.body;

    const userFound = await userModel.findOne({ email });
    if (userFound) return res.status(500).send("User already exists!");

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
            const userCreated = await userModel.create({
                username,
                name,
                age,
                email,
                password: hash
            })
            let token = jwt.sign({ email, userId: userCreated._id }, "secret");
            res.cookie("token", token);
            res.send("Registered!");
        })
    })

})

app.get('/login', (req, res) => {
    res.render('login');
})

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const findUser = await userModel.findOne({ email });
    if (!findUser) return res.redirect('/login');

    bcrypt.compare(password, findUser.password, (err, result) => {
        if (result) {
            let token = jwt.sign({ email, userId: findUser._id }, "secret");
            res.cookie("token", token);
            res.redirect('/profile');
        }
        else res.redirect('/login');
    })
})

app.get('/logout', (req, res) => {
    res.cookie("token", "");
    res.redirect('/login');
})

app.get('/profile', isLoggedIn, async (req, res) => {
    const userProfile = await userModel.findOne({ email: req.user.email }).populate("posts");
    // userProfile = await userProfile.;
    res.render('profile', { userProfile });
})

app.post('/post', isLoggedIn, async (req, res) => {
    const userProfile = await userModel.findOne({ email: req.user.email });
    // console.log(userProfile);
    const post = await postModel.create({
        user: userProfile._id,
        content: req.body.content,
    })

    userProfile.posts.push(post._id);
    await userProfile.save();
    res.redirect('/profile');
})

function isLoggedIn(req, res, next) {
    if (!req.cookies.token) res.redirect('/login');
    else {
        let data = jwt.verify(req.cookies.token, "secret");
        req.user = data;
        next();
    }
}

app.listen(3000, () => {
    console.log(`server is working at port: ${3000}`);
});

