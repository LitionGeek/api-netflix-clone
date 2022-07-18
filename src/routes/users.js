const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const verify = require("../utils/verifyToken");
const mercadopago = require("mercadopago")
const dotenv = require("dotenv")
const axios = require("axios")
dotenv.config();

router.put("/:id", verify, async (req, res) => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
        if (req.body.password) {
          req.body.password = CryptoJS.AES.encrypt(
            req.body.password,
            process.env.SECRET_KEY
          ).toString();
        }
    
        try {
          const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
              $set: req.body,
            },
            { new: true }
          );
          res.status(200).json(updatedUser);
        } catch (err) {
          res.status(500).json(err);
        }
    } else {
        res.status(403).json("You can update only your account!");
    }
});

router.delete("/:id", verify, async (req, res) => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
        try {
          await User.findByIdAndDelete(req.params.id);
          res.status(200).json("User has been deleted.");
        } catch (err) {
          res.status(500).json(err);
        }
      } else {
        res.status(403).json("You can delete only your account!");
      }
});

router.get("/find/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const {password,...info} = user._doc;
        res.status(200).json(info)
    } catch (err) {
        res.status(500).json(err)
    }
})

router.get("/", verify, async (req, res) => {
    const query = req.query.new;
    if (req.user.isAdmin) {
      try {
        const users = query
          ? await User.find().sort({ _id: -1 }).limit(5)
          : await User.find();
        res.status(200).json(users);
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(403).json("You are not allowed to see all users!");
    }
});


router.get("/stats",async(req,res)=>{
    const today = new Date();
    const lastYear = today.setFullYear(today.setFullYear()-1);

    try {
        const data = await User.aggregate([
            {
                $project:{
                    month:{$year:"$createdAt"}
                }
            },{
                $group:{
                    _id:"$month",
                    total:{$sum:1}
                }
            }
        ])
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json(error);
    }
})


router.get("/payment",async(req,res)=>{
/*  const producto = req.params.producto; */
 mercadopago.configure({
  access_token:process.env.ACCESS_MP
 })
 
 /* const url = "https://api.mercadopago.com/checkout/preferences"; */
 const preferences = {
  items:[
    {
      title:"Producto",
      unit_price:1000,
      quantity:1,
    }
  ]
 }
 mercadopago.preferences.create(preferences)
 .then(function(response){
  console.log(response.body)
  res.status(200).json({
    ok:true,
    link_pago:response.body
  })
 }).catch(function(error){
  console.log(error)
 })

})

module.exports = router;