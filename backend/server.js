import express from "express";
import router from "./routes/router.js";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

// creates an instance of the express application
const app = express();
const port = 3000;

// allows the app to parse HTTP cookies
app.use(cookieParser());

//middleware to parse json data in the request body
app.use(bodyParser.json());

// enable CORS for all routes
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
  });

// any request will be routed to the router
app.use("/", router);

// if the request url does not match anyone in the router, pass 404 not found error to the error-handling middleware
app.use((req, res, next) => {
    const notFound = new Error("Endpoint not found");
    notFound.status = 404;
    next(notFound);
});

// error handling middleware
app.use((error, req, res) => {
    console.error(error);
    res.status( error.status || 500).send(error.message || "An unknown error occurred");
});


//Creates a HTTP server using Node.js http module, and starts listening for any HTTP requests
app.listen(port, () => {
    console.log("Server running on port: " + port);
});

