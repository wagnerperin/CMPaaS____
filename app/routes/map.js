module.exports = app => {
    const api = app.apis.map;

    app
        .route('/map')
          .post(api.create);
  }
  