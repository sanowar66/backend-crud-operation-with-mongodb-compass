const express = require('express')
const router = express.Router()
const User = require('../../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

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
        const { type, email, password } = req.body
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
            res.status(401).json({ message: "Invalid email" })
        }
    } catch { res.status(500).json({ message: "Something went wrong." }) }

})


module.exports = router