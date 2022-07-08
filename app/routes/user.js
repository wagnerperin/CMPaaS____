module.exports = app => {
  const api = app.apis.user;
  const validateRequest = app.middlewares.schemaValidator(process.env.NODE_ENV == 'development');
  app
      .route('/user')
        .post(validateRequest, api.create)
        .get(api.list);
}