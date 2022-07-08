module.exports = app => {
  const api = app.apis.auth;
  const validateRequest = app.middlewares.schemaValidator(process.env.NODE_ENV == 'development');
  app
      .route('/auth')
        .post(validateRequest, api.authenticate);
}
