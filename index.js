require('dotenv').config()
const express = require('express');
const connectDB = require("./config/db");
const app = express();
connectDB()
const userRoute = require('./routes/api/users')
const taskRoute = require('./routes/api/tasks')
    //request of content type of body
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use('/api/users', userRoute)
app.use('/api/tasks', taskRoute)
    //define a simple route
app.get('/', (req, res) => {
        res.json({ message: ' Finally Welcome to my application.' })
    })
    //create user
    // let users = []
    // let lastId = 0
    // app.post('/users', (req, res) => {
    //         const user = req.body
    //         user.id = ++lastId
    //         users.push(user)
    //         res.json(user)
    //     })
    //find one user 
    // app.get('/users/:id', (req, res) => {
    //         const id = parseInt(req.params.id)
    //         const user = users.find(u => u.id === id)

//         if (!user) {
//             return res.status(404).json({ message: "User not found" })
//         }
//         res.json(user)
//     })
// ///update especifiq user
// app.put('/users/:id', (req, res) => {
//         const id = parseInt(req.params.id)
//         const userUpdate = req.body
//         const userIndex = users.findIndex((u) => u.id === id)
//         if (userIndex === -1) {
//             res.status(404).json({ message: "User Not Find" })

//         } else {
//             let user = users[userIndex]
//             users[userIndex] = {...users[userIndex], ...userUpdate, id }
//             res.json(users[userIndex])
//         }
//     })
//delete specific user
// app.delete('/users/:id', (req, res) => {
//         const id = parseInt(req.params.id)
//         const userIndex = users.findIndex((u) => u.id === id)

//         if (userIndex === -1) {
//             res.status(404).json({ message: "User Not Find" })
//         } else {
//             users.splice(userIndex, 1)
//             res.json({ message: "User Deleted Successfully." })
//         }
//     })
//retrieve the all users
// app.get('/users', (req, res) => {
//         res.json(users)
//     })
//start server here
const port = 3001
app.listen(port, () => {
    console.log(`Server running on port ${port}.`)
})