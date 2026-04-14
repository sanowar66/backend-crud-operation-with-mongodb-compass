const express = require('express')
const router = express.Router()
const User = require('../../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const authenticateToken = require('../../middleware/auth')
    //create user register
router.post('/register', async(req, res) => {

        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(req.body.password, salt)
        const userObj = {
            name: req.body.name,
            email: req.body.email,
            password: hash
        }
        const user = new User(userObj)
        await user.save()
        res.status(201).json(user)
    })
    // login users
router.post('/login', async(req, res) => {
        try {
            const { type, email, password, refreshToken } = req.body
            if (type == 'email') {
                const user = await User.findOne({ email: email })
                if (!user) {
                    res.status(401).json({
                        message: "User not found "
                    })
                } else {
                    const isValidPassword = await bcrypt.compare(password, user.password)
                    if (!isValidPassword) {
                        res.status(401).json({ message: "Password is incorrect" })
                    } else {
                        const accessToken = jwt.sign({ email: user.email, id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
                        const refreshToken = jwt.sign({ email: user.email, id: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" });
                        const userObj = user.toJSON()
                        userObj['accessToken'] = accessToken
                        userObj['refreshToken'] = refreshToken
                        res.status(200).json(userObj)
                    }
                }
            } else {

                if (!refreshToken) {
                    res.status(401).json({
                        message: "User not found "
                    })
                } else {
                    jwt.verify(refreshToken, process.env.JWT_SECRET, async(err, payload) => {
                        if (err) {
                            res.status(401).json({ message: "could not find the refresh token" })
                            return
                        } else {
                            const id = payload.id
                            const user = await User.findById(id);
                            if (!user) {
                                res.status(401).json({ message: "Unauthorized" })
                            } else {
                                const accessToken = jwt.sign({ email: user.email, id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
                                const refreshToken = jwt.sign({ email: user.email, id: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" });
                                const userObj = user.toJSON()
                                userObj['accessToken'] = accessToken
                                userObj['refreshToken'] = refreshToken
                                res.status(200).json(userObj)
                            }
                        }
                    })
                }
            }
        } catch { res.status(500).json({ message: "Something went wrong." }) }

    })
    //get profile
router.get('/profile', authenticateToken, async(req, res) => {
    try {
        const id = req.user.id;
        const user = await User.findById(id);
        if (user) {
            res.status(201).json(user);
        } else {
            res.status(401).json({ message: "Unauthorized" })
        }
    } catch {
        res.status(500).json({ message: "Something went wrong." })
    }
})


module.exports = router