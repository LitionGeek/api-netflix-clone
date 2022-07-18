const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/register",async (req,res)=>{
    const salt = bcrypt.genSaltSync(10);
    const newUser = new User({
        username:req.body.username,
        email:req.body.email,
        password:bcrypt.hashSync(req.body.password,salt)
    })
    try {
        await newUser.save().then((user)=>{
            res.status(201).json(user)
        }).catch(err=>{
            if(Object.keys(err.keyPattern) == "username"){
                return res.status(400).json({
                    ok:false,
                    message:"Username already exists."
                });
            }
            res.status(400).json({
                ok:false,
                message:"Email already exists."
            })
        })
    } catch (error) {
        res.status(500).json("Internal server error.")
    }
})


router.post("/login",async (req,res)=>{
    try {
        const user = await User.findOne({email:req.body.email});
        bcrypt.compareSync(user.password,req.body.password), function(err, res) {
            if(err || !user) {
                res.status(401).json({
                    ok:false,
                    message:"Wrong password or username"
                });
            }
        }
            const accessToken = jwt.sign({id:user._id,isAdmin:user.isAdmin},process.env.SECRET_KEY,{expiresIn:"3d"})
            const {password,...info} = user._doc;
            res.status(200).json({info,accessToken})
    } catch (error) {
        res.status(500).json("Internal server error");
    }
  
})

module.exports = router;