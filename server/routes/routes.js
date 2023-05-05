        var router = require("express").Router();
        const authHandler = require("../utilities/authUtilities");

        // create application/json parser


        // Sign IN and Sign Up routes
        const signInHandler = require("../userUtilities/signInUtilities.js");
        const signUpHandler = require("../userUtilities/signUpUtilities.js");
        const {getGoogleAuthCode} = require("../userUtilities/googleAuthUtilities");
        const {getOutlookAuthCode} = require("../userUtilities/outlookAuthUtilities");
        const {  getGoogleAuthURL } = require('../userUtilities/googleAuthUtilities');
        router.post("/signin",(req, res) => {signInHandler(req,res)});
        router.get("/signin/googleoauth",(req, res) => {getGoogleAuthCode(req,res)});
        router.get("/signin/outlookoauth",(req, res) => {getOutlookAuthCode(req,res)});

        router.post("/signup",(req, res) => {signUpHandler(req,res)});
        router.get("/signup/googleoauth",(req, res) => {getGoogleAuthCode(req,res)});
        router.get("/signup/outlookoauth",(req, res) => {getOutlookAuthCode(req,res)});

        //zhengren added this route and logic for user profile display function
        const gAuthUtilities = require("../userUtilities/googleAuthUtilities");
        router.get("/api/userinfo", async (req, res) => {
            const token = req.cookies["AUDIOMAILR_JWT"];
            if (!token) {
                return res.status(401).json({ error: "Unauthorized" });
            }
        
            try {
                const decoded = await authUtilities.verifyJWT(token);
                const userInfo = await gAuthUtilities.getUserInfo(decoded.user_id);
                if (userInfo) {
                return res.status(200).json(userInfo);
                } else {
                return res.status(404).json({ error: "User not found" });
                }
            } catch (error) {
                return res.status(500).json({ error: "Internal server error" });
            }
        });
        // Email routes
        const sendMailHandler = require("../emailUtilities/sendMailUtilities.js");
        const {sentMailHandler} = require("../emailUtilities/sentMailUtilities.js");
        const receiveMailHandler = require("../emailUtilities/receiveMailUtilities");
        const getAllMailHandler = require("../emailUtilities/getMailUtilities");
        router.get("/getallmail",(req, res,next) => authHandler.authHandler(req,res,next),(req, res) => {getAllMailHandler(req,res)});
        router.get("/receivemail",(req, res,next) => authHandler.authHandler(req,res,next),(req, res) => {receiveMailHandler(req,res)});
        router.post("/sendmail",(req, res,next) => authHandler.authHandler(req,res,next),(req, res) => {sendMailHandler(req,res)});
        router.get("/sent",(req, res,next) => authHandler.authHandler(req,res,next),(req, res) => {sentMailHandler(req,res)});
        //added this route by zhengren
        router.get("/google-auth-url", (req, res) => {
            const url = getGoogleAuthURL();
            res.header("Access-Control-Allow-Origin", "*");
            res.json({ url });
        });
     
        module.exports = router;