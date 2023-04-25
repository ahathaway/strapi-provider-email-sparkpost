"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
const sparkpost_1 = __importDefault(require("sparkpost"));
const init = function (providerOptions, settings) {
    const client = new sparkpost_1.default(providerOptions.apiKey);
    return {
        send(options) {
            return new Promise((resolve, reject) => {
                options.from = options.from || settings.defaultFrom;
                options.fromName = options.fromName || settings.defaultFrom;
                options.replyTo = options.replyTo || settings.defaultReplyTo;
                options.text = options.text || settings.text;
                options.html = options.html || settings.html;
                client.transmissions.send({
                    options: {
                        transactional: true,
                        open_tracking: false,
                        click_tracking: false
                    },
                    content: {
                        from: {
                            name: options.fromName,
                            email: options.from
                        },
                        subject: options.subject,
                        html: options.html,
                        reply_to: options.replyTo,
                        text: options.text
                    },
                    recipients: [
                        { address: options.to }
                    ]
                })
                    .then((data) => {
                    resolve(data);
                })
                    .catch((result) => {
                    const messages = result.errors.map((error) => { `${error.code}: ${error.message} - ${error.description}`; });
                    let err = new Error(messages.join("\n"));
                    err.stack = `\nCaused By:\n` + result.stack;
                    reject(err);
                });
            });
        },
        // @todo: actually template the emails
        sendTemplatedEmail(emailOptions, emailTemplate, data) {
            return new Promise((resolve, reject) => {
                emailOptions.from = emailOptions.from || settings.defaultFrom;
                emailOptions.fromName = emailOptions.fromName || settings.defaultFrom;
                emailOptions.replyTo = emailOptions.replyTo || settings.defaultReplyTo;
                emailTemplate.html = emailTemplate.html || settings.html;
                emailTemplate.text = emailTemplate.html || settings.text;
                client.transmissions.send({
                    content: {
                        from: {
                            name: emailOptions.fromName,
                            email: emailOptions.from
                        },
                        subject: emailTemplate.subject,
                        html: emailTemplate.html,
                        reply_to: emailOptions.replyTo,
                        text: emailTemplate.text
                    },
                    recipients: [
                        { address: emailOptions.to }
                    ]
                })
                    .then((data) => {
                    resolve(data);
                })
                    .catch((result) => {
                    const messages = result.errors.map((error) => { `${error.code}: ${error.message} - ${error.description}`; });
                    let err = new Error(messages.join("\n"));
                    err.stack = `\nCaused By:\n` + result.stack;
                    reject(err);
                });
            });
        },
    };
};
exports.init = init;
