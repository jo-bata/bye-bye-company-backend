const app = require('../app');
const config = require('../config/config');

app.set('port', process.env.PORT || config.express.port);

const server = app.listen(app.get('port'), () => {
  console.log(`Express server listening on port ${server.address().port}`);
});