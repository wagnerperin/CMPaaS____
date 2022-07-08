module.exports = app => {
  const {userAuthValidationSchema, userValidationSchema} = app.models.user;
  return {
    '/auth': userAuthValidationSchema,
    '/user': userValidationSchema
  };
}
