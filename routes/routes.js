var router = require("express").Router();
const authHandler = require("../utilities/authUtilities");

// Sign IN and Sign Up routes
const signInHandler = require("../userUtilities/signInUtilities.js");
const signUpHandler = require("../userUtilities/signUpUtilities.js");
const {getGoogleAuthCode} = require("../userUtilities/googleAuthUtilities");
const {getOutlookAuthCode} = require("../userUtilities/outlookAuthUtilities");

router.post("/signin",(req, res) => {signInHandler(req,res)});
router.get("/signin/googleoauth",(req, res) => {getGoogleAuthCode(req,res)});
router.get("/signin/outlookoauth",(req, res) => {getOutlookAuthCode(req,res)});

router.post("/signup",(req, res) => {signUpHandler(req,res)});
router.get("/signup/googleoauth",(req, res) => {getGoogleAuthCode(req,res)});
router.get("/signup/outlookoauth",(req, res) => {getOutlookAuthCode(req,res)});


// Email routes
const sendMailHandler = require("../emailUtilities/sendMailUtilities.js");
const {sentMailHandler} = require("../emailUtilities/sentMailUtilities.js");
const receiveMailHandler = require("../emailUtilities/receiveMailUtilities");
//const getAllMailHandler = require("../emailUtilities/getMailUtilities");
const setMailStatusHandler = require("../emailUtilities/mailStatusUtilities");
//router.get("/getallmail",(req, res) => authHandler.authHandler(req,res,next),(req, res) => {getAllMailHandler(req,res)});
router.get("/receivemail",(req, res,next) => authHandler.authHandler(req,res,next),(req, res) => {receiveMailHandler(req,res)});
router.post("/sendmail",(req, res,next) => authHandler.authHandler(req,res,next),(req, res) => {sendMailHandler(req,res)});
router.get("/sent",(req, res,next) => authHandler.authHandler(req,res,next),(req, res) => {sentMailHandler(req,res)});
router.post("/setMailStatus",(req, res,next) => authHandler.authHandler(req,res,next),(req, res) => {setMailStatusHandler(req,res)});


module.exports = router;