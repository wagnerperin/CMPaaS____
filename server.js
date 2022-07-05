const app = require('./conf/app');
const env = require('./conf/env');
const database = require('./conf/mongo');

database.connect(env.DBURI);

app.listen(env.PORT, env.HOST, () => {
  console.log(`Server running at http://${env.HOST}:${env.PORT}/`);
});
