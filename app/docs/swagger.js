module.exports = app => {
  const swaggerUi = require('swagger-ui-express');
  const swaggerDocument = require('./swagger.json');
  app.use(
    '/',
    (req, _, next) => {
      swaggerDocument.host = req.get('host');
      next();
    },
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
  );
}
