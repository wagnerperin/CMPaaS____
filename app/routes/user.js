module.exports = app => {
  const api = app.apis.user;
  app
      .route('/user')
        .post(api.create)
        .get(api.list);
}