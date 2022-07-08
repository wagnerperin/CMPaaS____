const env = require('./conf/env');
const app = require('./conf/app');
const mongo = require('./conf/mongo');

mongo.connect(env.DBURI);

if(require.main === module){
    app.listen(env.PORT, env.HOST, () => {
    console.log(`Server running at http://${env.HOST}:${env.PORT}/`);
  });
}else{
    module.exports = app;
}
