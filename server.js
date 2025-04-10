const express = require("express");
const cors = require("cors");

// const jobRoutes = require("./Router/jobRoutes");
// const candidateRoutes = require("./Router/candidateRoutes");

const authRoutes = require('./Router/authRoutes');
const protectedRoutes = require('./Router/protectedRoutes');

const dbConnect = require("./Connection/dbConnection");

const app = express();

const corsOptions = {
  origin: "http://localhost:3000", // Allow frontend URL
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Specify allowed methods
  credentials: true, // Allow cookies if needed
  allowedHeaders: "Content-Type, Authorization", // Allow necessary headers
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome Jaisika." });
});
// app.use('/api/jobs', jobRoutes);
// app.use('/api/candidates', candidateRoutes);

app.use('/api/auth', authRoutes);
app.use('/api', protectedRoutes); 

dbConnect();
// set port, listen for requests
const PORT = process.env.PORT || 8085;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});