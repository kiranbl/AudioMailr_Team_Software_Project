# Getting Started with Create React App and Redux

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), using the [Redux](https://redux.js.org/) and [Redux Toolkit](https://redux-toolkit.js.org/) template.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).




-------
## React App
npx create-react-app email_page --template redux

## Material UI
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material



## Update on 4/23/2023:
intial mailbox app
not finished yet. I only upload this to back for backup.
issues needed fixing:
# 1
For our convenience, I applied two .css files for each .js files in components folder.
By this mean, vijay's intial .css files are with the .js file stay in compontents folder.
But you can also adjust the style by editing the .css files in css folder.
I used two import approaches so there will be no conflicts if you check the classnames carefully.
Feel free to change the classnames so the intial .css files can be actived.

# 2
I moved all the components files to components folder that i created.
I created containers folder for container files of every components files.
By this mean, data-fetching and rendering are detached. Life is much easier.

# 3 
For now we just focus on meeting 8 of the 0 features on the list.
I have written some codes for the side functions that we may or may not want to make do.
Do not worry about them if you are confused.

# 4
The unread function is necessary. We must figure out that. Cause it says in the features list that the application shall allow the user to select what if all unread emails in the inbox should be read.

# 5
we need to create a button for user to indicate what emails they need to be read to them.
This is tricky. I still have no idea how to do it. Also in the features list.

# 6
After merging the log in system and mailbox, the navbar of the log in and sign up page became so long.
It could be some style conflict.



# dependencities for email providers

npm install react-google-login @azure/msal-browser
npm install react-google-login

npm install @azure/msal-browser


4/24 update

# mock json server for testing

//installation
npm install -g json-server

//runs it
json-server --watch db.json --port 3001