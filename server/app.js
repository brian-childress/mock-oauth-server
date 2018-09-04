const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const routes = require("./routes/routes");
const app = express();
let objSystem = { delayTime: 1000, errors: [] };

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use((request, response, next) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Credentials", "true");
  response.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  response.setHeader("Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  next();
});

//cors is a cross-origin-resource-sharing module that is used to manage cross-origin requests
app.use(cors());

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});


// Manage arguments passed in
const args = process.argv.slice(2);

args.forEach((val, index, args) => {

  // Check for error flag, [token, user, authentication, config, random]

  let next = args[index + 1];
  if (val === "-e") {

    if (objSystem.errors.indexOf(next >= 0)) {
      objSystem.errors.push(next.toLowerCase());
    }
  }

  if (val === "-d") {
    objSystem.delayTime = next;
  }

});

const server = app.listen(3000, () => {
  console.log("app running on port ", server.address().port);
});

app.get("/", function (req, res) {
  res.status(200).send("Welcome to our Mock SSO Server");
});

// Passing Client id
app.get("/authenticate", (req, res) => {
  objSystem.request = req;
  objSystem.response = res;

  routes.authenticate(objSystem)
    .then(() => {})
    .catch((error) => {
      console.log(`ERROR: GET /authenticate returned: ${error}`);
    });

});

/**
 * oauthparams
 */
app.get("/oauthparams", (req, res) => {
  objSystem.request = req;
  objSystem.response = res;

  routes.oauthParams(objSystem)
    .then(() => {})
    .catch((error) => {
      console.log(`ERROR: GET /oauthparams returned: ${error}`);
    });

});

app.post("/token", (req, res) => {
  objSystem.request = req;
  objSystem.response = res;

  routes.token(objSystem)
    .then(() => {})
    .catch((error) => {
      console.log(`ERROR: POST /token returned: ${error}`);
    });

});

app.get("/userinfo", (req, res) => {
  objSystem.request = req;
  objSystem.response = res;

  routes.userInfo(objSystem)
    .then(() => {})
    .catch((error) => {
      console.log(`ERROR: GET /userinfo returned: ${error}`);
    });
});

app.get("/protectedRoute", (req, res) => {
  // Verify JWT
});

app.get("/unprotectedRoute", (req, res) => {

  res.send(200).send("You accessed an unprotected route");

});