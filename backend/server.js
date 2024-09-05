const express = require('express');
const http = require('http')
const cors = require('cors')
const { initIO } = require('./socket/socket.js');
const system = require('./middlewares/system.js');

require('dotenv').config()
const PORT = process.env.PORT || 4000;
const app = express();


const server = http.createServer(app);
initIO(server)

app.use(cors())
app.use(express.json());

app.get('/', (req, res, next) => {
    res.status(200).json({ message: 'hello world' });
});


// Routes
app.use('/api/v-1', require('./routes/index.route.js'))

// Error
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});


server.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});
