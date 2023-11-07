require('dotenv').config()

const express = require('express');
const appRoute = require('./routes/route.js')
// const { PORT } = require('./env.js')


const app = express();

app.use(express.json());
``
/** routes */
app.use('/api', appRoute);

const port = process.env.PORT || 9999

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})
