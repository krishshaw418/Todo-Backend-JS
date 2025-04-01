const express = require('express');
const router = express.Router();
const {Todos} = require('../models/models');
const authenticate = require('../middlewares/auth');

router.post(`/new-todo`, authenticate, async (req, res) => {
    const {title, description} = req.body;
    const newTodo = new Todos({
        title,
        description,
    });
    try {
        await newTodo.save();
        const user = req.user;
        user.todos.push(newTodo._id);
        await user.save();
        return res.json({sucess: true, message: "Todo added sucessfully!"});
    } catch (error) {
        console.error("Error adding new todo:", error);
        return res.json({sucess: false, message: "Error adding new todo!"});
    }
})

router.get(`/get-todos`, authenticate, async(req, res) => {
    const user = req.user;
    try {
        const todos = await Todos.find({_id: {$in: user.todos}});
        if(!todos){
            return res.json({sucess: false, message: "Internal Server Error!"});
        }
        return res.json({sucess: true, todos});
    } catch (error) {
        console.error("Error fetching todos:", error);
        return res.json({sucess: false, message: "Error fetching todos!"});
    }
})

router.delete(`/delete-todo/:id`, authenticate, async (req, res) => {
    const {id} = req.params;
    const user = req.user;
    try {
        const deletedTodo = await Todos.findOneAndDelete({_id:id});
        if (!deletedTodo) {
            return res.json({ success: false, message: "Todo not found!" });
        }
        user.todos = user.todos.filter(todo => todo.toString() !== id); //updating the todos
        await user.save();
        return res.json({sucess: true, message: "Todo deleted successfully!"});
    } catch (error) {
        console.error("Error deleting todo:", error);
        return res.json({sucess: false, messgae: "Error deleting todo!"});
    }
})

router.put(`/edit-todo/:id`, authenticate, async(req,res) => {
    const id = req.params.id;
    const {title, description} = req.body;
    try {
        const updatedTodo = await Todos.findByIdAndUpdate(id, {title: title, description: description}, {new:true});
        if(!updatedTodo)
        return res.json({sucess:false, message:"Falied to update todo"});
        return res.json({sucess: true, updatedTodo});
    } catch (error) {
        console.error(error);
        return res.json({sucess:false, message:"Internal server error!"});
    }

})

router.post(`/logout`, (req, res) => {
    res.clearCookie('sessionId',{
        httpOnly: false,
        secure: true,
        sameSite: 'none',
    });
    return res.json({sucess: true, message: "Logged out successfully!"});
})

module.exports = router;