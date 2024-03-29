module.exports = app => {
  const _ = require('lodash');
  const schemas = app.middlewares.schemas;
  
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

      if(_.includes(_supportedMethods, method) && _.has(schemas, route)){
        const _schema = _.get(schemas, route); // get the schema for the route
        if(_schema){
          const {value, error} = _schema.validate(req.body, _validationOptions);
          if(error){
            const joiError = {
              status: 'failed',
              error: {
                original: error._object,
                details: _.map(error.details, ({message, type}) => ({
                  message: message.replace(/['"]/g, ''),
                  type
                }))
              }
            };
            const customError = {
              status: 'failed',
              error: 'Invalid request data. Please review request and try again.'
            };
            res.status(400).json(_useJoiError ? joiError : customError);
          }else{        
            req.body = value; // Replace req.body with the data after Joi validation
            next();
          }
        }else{
          res.status(500).json({
            status: 'failed',
            error: 'Error geting the validation schema.'
          });
        }
      }else{
        res.status(500).json({
          status: 'failed',
          error: 'Error in validation.'
        });
      }
    };
  };
}
