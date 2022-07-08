module.exports = app => {
  const api = app.apis.user;
  const auth = app.apis.auth;
  const validateRequest = app.middlewares.schemaValidator(process.env.NODE_ENV == 'development');
  app
      .route('/user')
        .post(validateRequest, api.create)
        .get(auth.authenticationRequired, api.list);
}
