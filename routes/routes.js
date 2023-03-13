var router = require("express").Router();
var bodyParser = require('body-parser')

const authHandler = require("../utilities/authUtilities");

// create application/json parser
var jsonParser = bodyParser.json()

// Sign IN and Sign Up routes
const signInHandler = require("../userUtilities/signInUtilities.js");
const signUpHandler = require("../userUtilities/signUpUtilities.js");
router.post("/signin",(req, res) => {signInHandler(req,res)});

router.post("/signup",jsonParser,(req, res) => {signUpHandler.create(req,res)});



// Email routes
const sendMailHandler = require("../emailUtilities/sendMailUtilities.js");
const getMailHandler = require("../emailUtilities/getMailUtilities");
const getAllMailHandler = require("../emailUtilities/getMailUtilities");
router.get("/getallmail",(req, res) => authHandler(req,res,next),(req, res) => {getAllMailHandler(req,res)});
router.get("/getmail",(req, res) => authHandler(req,res,next),(req, res) => {getMailHandler(req,res)});
router.post("/sendmail",(req, res) => authHandler(req,res,next),(req, res) => {sendMailHandler(req,res)});



module.exports = router;