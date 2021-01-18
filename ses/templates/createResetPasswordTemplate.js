const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');

AWS.config.apiVersions = {
    ses: '2010-12-01',
};

AWS.config.region = 'us-west-2';

const HtmlPart = fs.readFileSync(path.resolve(__dirname, 'resetPasswordHtml.html'), 'utf8');

const templateName = 'reset_password'

const createResetPasswordTemplate = {
    Template: {
        TemplateName: templateName,
        HtmlPart,
        SubjectPart: '{{name}}, Your Reset Password Link',
        TextPart: 'Greetings, {{name}}. Here is the reset password link that you requested: {{url}}.' +
            ' If you did not request this, ignore or contact mern-starter@gmail.com.',
    },
};

const ses = new AWS.SES();

ses.createTemplate(createResetPasswordTemplate, (err, data) => {
    if (err) {
        console.log('Failure');
        console.log(err);
    }
    else {
        console.log('Success');
        console.log(data);
    }
});