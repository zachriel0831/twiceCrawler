const express = require('express');
const cors = require('cors');
const mustacheExpress = require('mustache-express');
const mongoose = require('mongoose')
const imageRoute = require('./routes/index');

require('dotenv').config({ path: './.env' });

mongoose.connect(`mongodb+srv://zack:zack0831@tradingcarddb.40fgm.gcp.mongodb.net/twice_crawler?retryWrites=true&w=majority`,{useNewUrlParser: true}).then(() => {
    console.log('Connection to the Atlas Cluster is successful!')
  }).catch( (err) => console.error(err));


let app = express();

const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(cors());
app.engine('html',mustacheExpress())
app.set('view engine','html')
app.set('views',__dirname + '/src/views')
app.use(express.static(__dirname + '/public'));
app.use('/', imageRoute);

app.listen(PORT, function () {
    console.log(`Listening on port ${PORT}`);
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);

});
