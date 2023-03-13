var router = require("express").Router();
const authHandler = require("../utilities/authUtilities");

// Sign IN and Sign Up routes
const signInHandler = require("../userUtilities/signInUtilities.js");
const signUpHandler = require("../userUtilities/signUpUtilities.js");
router.post("/signin",(req, res) => {signInHandler(req,res)});
router.post("/signup",(req, res) => {signUpHandler(req,res)});


// Email routes
const sendMailHandler = require("../emailUtilities/sendMailUtilities.js");
const getMailHandler = require("../emailUtilities/getMailUtilities");
const getAllMailHandler = require("../emailUtilities/getMailUtilities");
router.get("/getallmail",(req, res) => authHandler(req,res,next),(req, res) => {getAllMailHandler(req,res)});
router.get("/getmail",(req, res) => authHandler(req,res,next),(req, res) => {getMailHandler(req,res)});
router.post("/sendmail",(req, res) => authHandler(req,res,next),(req, res) => {sendMailHandler(req,res)});



module.exports = router;