# Project 40
Using arranging a holiday for my birthday as an excuse to play around with TypeScript and React. Probably much easier to use something like PaperlessPost, but where is the learning curve in that!

Lightweight backend to store RSVP data developed and hosted in Google App Scripts. A fairly simple and free way to POST and GET data into a spreadsheet datastore. Only downside was that CORS did not seem particularly configurable, therefore I'm POSTing the form data as 'application/x-www-form-urlencoded' rather than 'application/json' which doesn't trigger a cors preflight check; a bit of a hack but I'm still sending plain text json to ease the encoding/decoding.

Front end is styled with a Solid State theme by [HTML5 UP](html5up.net), which I've integrated using it's existing CSS and existing JS function to handle the scrolling/menu. Upon further research I did find a react componentised version of theme, however it was a bit too late as I'd already integrated, shout out to [filoxo](https://github.com/filoxo/solid-state-react) and their repo for this should you wish to use it. The main hack to get the existing template's js working as is, was defining a TypeScript interface for the 'main' method and calling it from a useEffect hook, such that it executed after the DOM was rendered and the TS compliler/linter was happy. Unrelated to the template, an honorary credit to [rafgraph's Single Page App hack](https://github.com/rafgraph/spa-github-pages) for React Routers for sites hosted on GitHub Pages.

## Project Structure
- `gas-src/` - Google App Scripts Source, used for the server side elements, namely RSVP Service
    - Although Google maintains its own versioning and deployment, keeping a copy here for reference
- `public/` - The static web assets, including the index.html landing page
    - Keeping the untouched JavaScript from the HTML styling Template here, no 'business' logic here
- `src/` - All the source for the front end and associated logic
- `.env`- Environment variables for the service endpoints
- `.env.development.local` - Not comitted to git, REACT_APP_RSVP_SERVICE_ID is defined here 
- `.env.production.local` - Not comitted to git, REACT_APP_RSVP_SERVICE_ID is defined here

## Quick Start
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) and therefore in the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

### `npm run deploy`

Builds the app and deploys it to the configured GitHub pages site.
