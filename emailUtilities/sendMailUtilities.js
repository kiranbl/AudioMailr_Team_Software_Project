const nodemailer = require("nodemailer");
const smtpTransport=require("nodemailer-smtp-transport");
const validator = require("../utilities/validationUtilities");
const dbQueryUtilities = require("../utilities/dbQueryUtilities");
const dbUtilities = require("../utilities/dbUtilities");
const sgMail = require('@sendgrid/mail')

sgMail.setApiKey("")



let sendEmail = async (data,emailTemplate) =>{
    
    try{
        const msg = {
            to: 'kiran.pro13@gmail.com', // Change to your recipient
            from: 'kiran.kicchu@gmail.com', // Change to your verified sender
            subject: 'Sending with SendGrid is Fun',
            text: 'and easy to do anywhere, even with Node.js',
            html: '<strong>and easy to do anywhere, even with Node.js</strong>',
          }
          
          let sendMail = await sgMail.send(msg);
          console.log(":Send Mail Response --->>>> ",sendEmail)
    }
    catch(error){
        console.log(error);
    }
   
      

    let transporter = nodemailer.createTransport(smtpTransport({
        service:"gmail",
        auth: {
          host: "smtp.gmail.com",
          port:465,
          secure:true,
          user: "",
          pass: "",
        },
        }
    ));
    transporter.verify(function(error, success) {
      if (error) {
        console.log(error);
      } else {
        console.log("Server is ready to take our messages");
      }
    });
    
      let info = await transporter.sendMail({
        from: 'audiomailr.team12@gmail.com', // sender address
        to: "kiran.kicchu@gmail.com", // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>", // html body
      });
    
      console.log(info)


    var smtpProtocol = nodemailer.createTransport({
        host: "smtp.mail.yahoo.com",
        port: 587,
        secure: false,
        auth: {
          user: "",
          pass: ""
      }
  });
  
  var mailoption = {
      from: "audiomailr@​yahoo.com",
      to: "kiran.kicchu@gmail.com",
      subject: "Test Mail",
      html: 'Good Morning!'
  }
  
  smtpProtocol.sendMail(mailoption, function(err, response){
      if(err) {
          console.log(err);
      } 
      console.log('Message Sent' + response.message);
      smtpProtocol.close();
  });

}




  let sendMailHandler = async (req,res)=>{
    console.log(req.decodedData)
//     if (!req.body) {
//         res.status(400).json({
//           statusCode: 400,
//           message: "Content can not be empty!",
//         });
//   }else {
    // var validatorResponse = validator.emailValidator(req.body);
    // if (validatorResponse) {
    //   return res.json(validatorResponse);
    // }
    var emailTemplate = {
    //   toAddress: req.body.toAddress,
    //   subject: req.body.subject,
    //   body:req.body.text
    };
    
    // if(req.body.html){
    //     emailTemplate["html"] = req.body.html
    // }
    
    var sendEmailResponse = await sendEmail(req.decodedData,emailTemplate);
    return res.json(sendEmailResponse);
//   }

}


module.exports = sendMailHandler;
