const app = require('./app');
require('dotenv').config();
const { mongoConnection } = require('./model/mongoconnection');
const port = process.env.PORT || 4001;

app.listen(port, async() => {
    await mongoConnection()
    console.log(`Server running at http://localhost:${port}`);
});
