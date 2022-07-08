module.exports = app => {
  const userValidationSchema = app.models.user;
  module.exports = { '/user': userValidationSchema };
}