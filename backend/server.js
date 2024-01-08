import express from "express";
import router from "./routes/router";
import cookieParser from "cookie-parser";

// creates an instance of the express application
const app = express();
const port = 3000;

// allows the app to parse HTTP cookies
app.use(cookieParser());

// any api request will be routed to the router
app.use("/api", router);

// if the request url does not match anyone in the router, pass 404 not found error to the error-handling middleware
app.use((req, res, next) => {
    const notFound = new Error("Endpoint not found");
    notFound.status = 404;
    next(notFound);
});

// error handling middleware
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error, req, res, next) => {
    console.error(error);
    res.status( error.status || 500).send(error.message || "An unknown error occurred");
});


//Creates a HTTP server using Node.js http module, and starts listening for any HTTP requests
app.listen(port, () => {
    console.log("Server rumning on port: " + port);
});

