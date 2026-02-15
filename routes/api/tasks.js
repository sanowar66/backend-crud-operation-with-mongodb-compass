const express = require('express')
const router = express.Router()
const Task = require('../../models/Task')
const { findById } = require('../../models/User')

//create a task
router.post('/', async(req, res) => {
        const taskObj = {
            title: req.body.title,
            desc: req.body.desc,
            status: req.body.status
        }
        const task = new Task(taskObj)
        await task.save()
        res.status(201).json(task)
    })
    //get all task
router.get('/', async(req, res) => {
        try {
            const task = await Task.find({})
            res.json(task)
        } catch (error) {
            res.status(500).json({ message: "Something went wrong." })
        }
    })
    //get one users
router.get('/:id', async(req, res) => {
        try {
            const id = req.params.id
            const oneTask = await Task.findById(id)
            if (oneTask) {
                res.json(oneTask)
            } else {
                res.status(404).json({ message: "Task not found." })
            }
        } catch (error) {
            res.status(500).json({ message: "Something went wrong." })
        }
    })
    //updated task
router.put('/:id', async(req, res) => {
        try {
            const id = req.params.id
            const updateTask = await Task.findByIdAndUpdate(id, {
                title: req.body.title,
                desc: req.body.desc,
                status: req.body.status
            }, { new: true })
            if (updateTask) {
                res.json(updateTask)
            } else {
                res.status(404).json({ message: "Task not found." })
            }
        } catch {
            res.status(500).json({ message: "Something went wrong" })
        }
    })
    //delete task
router.delete('/:id', async(req, res) => {
    try {
        const id = req.params.id
        const deleteTask = await Task.findByIdAndDelete(id)
        if (deleteTask) {
            res.json({ message: "Task Deleted Successfully," })
        } else {
            res.status(404).json({ message: "Task not found." })
        }
    } catch {
        res.status(500).json({ message: "Something went wrong" })
    }
})


module.exports = router