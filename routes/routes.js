var router = require("express").Router();
const authHandler = require("../utilities/authUtilities");

// create application/json parser


// Sign IN and Sign Up routes
const signInHandler = require("../userUtilities/signInUtilities.js");
const signUpHandler = require("../userUtilities/signUpUtilities.js");
const {getGoogleAuthCode} = require("../userUtilities/googleAuthUtilities");
router.post("/signin",(req, res) => {signInHandler(req,res)});
router.get("/signin/googleoauth",(req, res) => {getGoogleAuthCode(req,res)});

router.post("/signup",(req, res) => {signUpHandler(req,res)});
router.get("/signup/googleoauth",(req, res) => {getGoogleAuthCode(req,res)});


// Email routes
const sendMailHandler = require("../emailUtilities/sendMailUtilities.js");
const receiveMailHandler = require("../emailUtilities/receiveMailUtilities");
const getAllMailHandler = require("../emailUtilities/getMailUtilities");
router.get("/getallmail",(req, res) => authHandler.authHandler(req,res,next),(req, res) => {getAllMailHandler(req,res)});
router.get("/receivemail",(req, res,next) => authHandler.authHandler(req,res,next),(req, res) => {receiveMailHandler(req,res)});
router.post("/sendmail",(req, res,next) => authHandler.authHandler(req,res,next),(req, res) => {sendMailHandler(req,res)});



module.exports = router;