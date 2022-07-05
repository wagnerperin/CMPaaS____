const app = require('./conf/app');
const env = require('./conf/env');
const mongo = require('./conf/mongo');

mongo.connect(env.DBURI);

app.listen(env.PORT, env.HOST, () => {
  console.log(`Server running at http://${env.HOST}:${env.PORT}/`);
});
