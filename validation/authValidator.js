const { celebrate, Joi, Segments } = require('celebrate');

module.exports = {
     signup: () => celebrate({
        [Segments.BODY]: Joi.object().keys({
            username: Joi.string().alphanum().min(3).max(30).required(),
            email: Joi.string().email().trim(true).required(),
            password: Joi.string()
                .pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*()_+{}|:"<>?`\\-=[\\]\\\\;\',./\b\n\r\t\f]{3,30}$'))
                .min(8)
                .required(),
            firstName: Joi.string().min(3).max(30).required(),
            lastName: Joi.string().min(3).max(30).required(),
            description: Joi.string().min(3).required(),
            type: Joi.string().min(3).max(30).required().valid('EMPLOYEE', "ORGANISATION"),
            role: Joi.string().min(3).max(30).required().valid("JUNIOR", "SENIOR", "TEAMLEADER", "PROJECT_MANAGER"),
            status: Joi.string().min(3).max(30).required().valid("ACTIVE", "CLOSED", "INVITED", "DELETED", "PENDING", "DEACTIVE"),
        })
    }),
    signIn: () => celebrate({
        [Segments.BODY]: Joi.object().keys({
            username: Joi.string().alphanum().min(3).max(30).required(),
            email: Joi.string().email().trim(true).required(),
            password: Joi.string()
                .pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*()_+{}|:"<>?`\\-=[\\]\\\\;\',./\b\n\r\t\f]{3,30}$'))
                .min(8)
                .required(),
        })
    }),

};