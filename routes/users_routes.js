const express = require("express")
const User = require("../model/UserModel")
const user_routes = express.Router()
const bcrypt = require("bcryptjs")
const salt = bcrypt.genSaltSync(10)
const jwt = require("jsonwebtoken")
require("dotenv")

const {SECRET_KEY} = process.env

// create user
user_routes.post("/user/create", async(req,res)=>{
    try {
        const data = await req.body
        const createuser = await User.create({
            data : {
                email : data.email,
                password : bcrypt.hashSync(data.password, salt),
                avatar : data.avatar
            }
        })

        res.status(201).json({
            success : true,
            msg : "Berhasil tambah user"
        })

    } catch (error) {
        res.status(500).json({
            success : false,
            error : error.message
        })
    }
})

// login user
user_routes.post("/user/login", async(req,res)=>{
    try {
        const {email, password} = await req.body

        // kita check apakah email ada
        const checkEmail = await User.findUnique({
            where : {
                email : email
            }
        })

        if(!checkEmail){
            return res.status(404).json({
                success : false,
                msg : "user tidak ditemukan"
            })
        }

        // check password
        const checkPassword = await bcrypt.compareSync(password, checkEmail.password)

        if(!checkPassword){
            return res.status(401).json({
                success : false,
                msg : "password salah"
            })
        }

        // generated jwt token
        const generateToken = await jwt.sign({
            user_id : checkEmail.id,
            user_email : checkEmail.email
        }, SECRET_KEY, {
            expiresIn : "1d"
        })

        res.status(200).json({
            success : true,
            token : generateToken
        })

    } catch (error) {
        res.status(500).json({
            success : false,
            error : error.message
        })
    }
})

//update
user_routes.put("/user/update", async(req,res)=>{
    try {
        const data = await req.body
        const updateUser = await User.update({
            where : {
                id : parseInt(data.id)
            },
            data : {
                email : data.email,
                password : bcrypt.hashSync(data.password, salt),
                avatar : data.avatar
            }
        })

        res.status(201).json({
            success : true,
            msg : "berhasil update user"
        })

    } catch (error) {
        res.status(500).json({
            success  :false,
            error : error.mesage
        })
    }
})

// read all user
user_routes.post("/user/read", async(req,res)=>{
    try {
        const { filter, select } = await req.body
        const { page = 1, limit = 10 } = await req.query
        const skip = (page - 1) * limit
        const getUser = await User.findMany({
            where : filter,
            select : select,
            skip : parseInt(skip),
            take : parseInt(limit)
        })

        const countUser = await User.count()

        res.status(200).json({
            success  :true,
            current_page : parseInt(page),
            total_page : Math.ceil(countUser / limit),
            query : getUser
        })

    } catch (error) {
        res.status(500).json({
            success  :false,
            error : error.mesage
        })
    }
})


module.exports = user_routes