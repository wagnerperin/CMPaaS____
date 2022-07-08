module.exports = app => {
  const _ = require('lodash');
  const Joi = require('joi');
  const Schemas = require('./schemas');
  
  return (useJoiError = false) => {
    const _useJoiError = _.isBoolean(useJoiError) && useJoiError;
    const _supportedMethods = ['post', 'put'];
    const _validationOptions = {
      abortEarly: false,  // abort after the last validation error
      allowUnknown: true, // allow unknown keys that will be ignored
      stripUnknown: true  // remove unknown keys from the validated data
    };

    return (req, res, next) => {
      const route = req.route.path;
      const method = req.method.toLowerCase();

      if (_.includes(_supportedMethods, method) && _.has(Schemas, route)) {
        const _schema = _.get(Schemas, route); // get the schema for the route
        if (_schema) {
          const { value, error } = _schema.validate(req.body, _validationOptions);
          if(error) {
            const JoiError = {
              status: 'failed',
              error: {
                original: error._object,
                details: _.map(error.details, ({message, type}) => ({
                  message: message.replace(/['"]/g, ''),
                  type
                }))
              }
            };
            const CustomError = {
              status: 'failed',
              error: 'Invalid request data. Please review request and try again.'
            };
            res.status(400).json(_useJoiError ? JoiError : CustomError);
          } else {        
            req.body = value; // Replace req.body with the data after Joi validation
            next();
          }
        }
      }
    };
  };
};