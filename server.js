const express = require('express');
const connectDB = require('./config/db');
const path = require('path');
var bodyParser = require('body-parser')
const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
// Define Routes
// app.use('/api/users', require('./routes/api/users'));
// app.use('/api/auth', require('./routes/api/auth'));
// app.use('/api/profile', require('./routes/api/profile'));
// app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/shortenLink', require('./routes/api/shortenLink'))


// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
