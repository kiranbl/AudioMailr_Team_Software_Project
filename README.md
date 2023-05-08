##  Package used:React+Redux 

## installation
js:
npm install 
notice that this project can only work on react and react-don version 17.0.2
check package.json and see full dependencies

## Solutions to Cross-Domain Problems
1. back-end: 3rd party cors
npm install --save cors
2. front-end: Set up a cross-domain proxy

## server auto updatemethod 
npm install -g nodemon

## how to run the project
1. run database
2. open a terminal, go to server/project(whihc is back end repository),run nodemon index.js
3. go back to project and run npm start

## Update 3/13:
Created initial Header page, Home page, Signin page and SignUp page.
Created initial Router page.
Built initial Signup page.

## Update 3/22:

task reassignment, see details in journary

components building for side functionalities on progress.

## Update 3/27:

frond-end & back-end connection completed.

signup & signin function completed.


## Update 5-5:

After complete mergeing with back-end, now the most tricky part of this project is cleared

Now frond-end and back-end are well connected, the gamil part is nearly done

From now on, my branch will be including both front-end and server-end

I have included the a doc called "table" on the root, which contains the database set up

If you have any doubts about this instruction file, speak to kiran, he made it

The back end code is slightly different from the one on kiran's or leyan's

I have commented most of the changes

Below I will demonstrate the brief work flow of the project

## Routes of entry:

# User can log in and play with the mock mailbox app without any provider account

User can go to sign up link and register an local account which is stored in local database
By successfully logging in, user is dericted to the mailbox url
The sample mailbox app does not support Compose function

# The main entrance is the googleIcon button and OutLookIcon button.

click gmail button 
=>>> body {authtype:"google"} 
// auth request sent to gmail
===>>>  /signin or signup api
// get access
 ===>>>> {url:"dasdsahjkhdbksad/xciasics"} 
// generate url for user's gmail account to get access of our app
==>>> open it in a new tab for user 
// user directed to the url and gets permition to our app
====>> usertoken generated after login 
// token generated, server side pass token to client side with an encryption method
=>>> redirect the user to the dashboard after sending get request to /receivemail api
// client side decrypt token in the cookie, use this token to apply api calls to gmail
=>>> resposne ===> [{},{}]
// for instance, frond end make api call to server, server end point make request to gmail and pull inbox to our app
// the front-end will re-structure the response data, transform the data into Redux store for client side functionalities

This flow is from my perspective, if one wants to know more, speak to back-end team

# featurelist of this project (we need to do 8 out of 9)

1. The application shall act as an email client, where a user is allowed to send or receive emails.
status: receive checked, now doing send, hopefully finish it on 5/6 or 5/7
approach of receive: for receive, as mentioned before, if user logs in the app with google or outlook account,
this app automatically pulls all the "unread" emails from their inbox with an api get request;
for send, app applies a post request
approach of send: user should be able to send emails with the app, and the sent email should be visiable in the 
sent box.

2. The application shall make use of IMAP and SMTP protocols to achieve requirement 1 above
status: check
approach: unknown

3. The application shall allow a user to login using their email and password.
status: check
approach: we have a local data for this. Front-end pass the form of user information to server, then server handles
the check, storage, then generate a token, pass it back to fron-end

4. The application shall allow a user to indicate what emails they need to be read to them
status: check
approach: User can do that by opening one mail and then clicking "read" button

5. The user shall have the ability to select the preferred voice from a list of 2-3.
status: check
approach: User can do that by opening one mail and then adjust the voice perferences on "Settings" button

6. The application shall allow the user to select what if all unread emails in the Inbox should be read
status: check
approach: User can do that by opening one mail and then clicking "read all unread emails" button

7. The application shall allow a user to select specific times when emails should be read. E.g. Read all unread
emails to me by 5pm
status: ???
Jianing please confirm on this one really soon

8. The application shall be able to work with multiple email addresses. E.g. - Work email and personal email.
status: doing now
approach: the app is supposed to allow user to pull emails from different accounts, which means, e.g. one 
can read gmail and outlook at same time in one app. this part is on progress
I plan to make it do on the user profile dropbox button on top right
after I finish feature 1, I will look into this one

9. The application shall be able to work with any email provider that supports IMAP and SMTP.
status: we instantly give up on this one, which is more of a joke than feature

# send mail 
click compse mail
===>>

{
    "toAddress":"any mail",
    "subject":"",
    "text":""
}
===>>> send post request to /sendmail
====>> response -> {
    "errorcode": 6000,
    "message": "Mail has been sent to kiran.pro13@gmail.com successfully.."
}



## Update 5-8:


# featurelist of this project (we need to do 8 out of 9)

1. The application shall act as an email client, where a user is allowed to send or receive emails.
status: check

2. The application shall make use of IMAP and SMTP protocols to achieve requirement 1 above
status: check

3. The application shall allow a user to login using their email and password.
status: check
approach: after discussion, we decided to remove the sign up and log in system we made from our main entrance, since
it does not really help our app meet the requirements
however we kept it as a prototype as part of our work

4. The application shall allow a user to indicate what emails they need to be read to them
status: check
approach: User can do that by opening one mail and then clicking "read" button

5. The user shall have the ability to select the preferred voice from a list of 2-3.
status: check
approach: User can do that by opening one mail and then adjust the voice perferences on "Settings" button

6. The application shall allow the user to select what if all unread emails in the Inbox should be read
status: check
approach: User can do that by opening one mail and then clicking "read all unread emails" button

7. The application shall allow a user to select specific times when emails should be read. E.g. Read all unread
emails to me by 5pm
status: check

8. The application shall be able to work with multiple email addresses. E.g. - Work email and personal email.
status: check
approach: google + outlook on same portal

9. The application shall be able to work with any email provider that supports IMAP and SMTP.
status: we instantly give up on this one, which is more of a joke than feature

added:
mark as read fucntion for user to actually change the status of emails from the remote inbox
by this mean, user now has full control of email list


