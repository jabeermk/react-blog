const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key')


const { User } = require('./models/user');
const { auth } = require('./middleware/auth');

mongoose.connect(config.mongoURI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: true
}).then(() => console.log('DB connected'))
    .catch(err => console.error(err));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());


app.get('/', (req, res) => {
    res.json({ "hello": "I am happy to deploy our application" })
});

app.get('/api/users/auth', auth, (req, res) => {
    res.status(200).json({
        _id: req._id,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role
    })

})

app.post('/api/users/register', (req, res) => {
    const user = new User(req.body)
    user.save((err, doc) => {
        if (err) return res.json({ success: false, err })
        return res.status(200).json({
            success: true,
            userData: doc
        })

    })
})

app.post('/api/users/login', (req, res) => {
    //find the email
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user)
            return res.json({
                loginSuccess: false,
                message: "Auth failed, email not found"
            });
        //cpmpare password
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch) {
                return res.json({ loginSuccess: false, message: "wrong password" })
            }

        })
        //generate token
        user.generateToken((err, user) => {
            if (err) return res.status(400).send(err);
            res.cookie("x_auth", user.token)
                .status(200)
                .json({
                    loginSuccess: true
                });
        });
    });
});

app.get('/api/users/logout', auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, { token: '' }, (err, doc) => {
        if (err) return res.json({ success: false, err })
        return res.status(200).send({
            success: true
        });
    });
});

// app.get('/', (req, res) => {
//     res.send('hello world')
// });

//const port=process.env.PORT || 5000;

app.listen(process.env.PORT || 5000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });

// const port = process.env.PORT || 5000

// app.listen(process.env.PORT, () => {
//     console.log(`Server Runninng at ${port}`)
// });

// app.get('/', (req, res) => {
//     res.json('jsonnodemon..ajfkajfskjfklsjfksdj')
// });