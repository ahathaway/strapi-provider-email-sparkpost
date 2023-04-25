import SparkPost from 'sparkpost';

export const init = function(
  providerOptions: { apiKey: string },
  settings: {
    defaultFrom: string,
    defaultReplyTo: string,
    testAddress: string,
    text?: string,
    html?: string
  }
): any {
  const client = new SparkPost(providerOptions.apiKey);

  return {
    send(
      options: {
        to: string
        from?: string,
        cc?: string,
        bcc?: string,
        replyTo?: string,
        subject: string,
        text?: string,
        html?: string,
        fromName?: string,
      }
    ) {
      return new Promise((resolve, reject) => {
        options.from = options.from || settings.defaultFrom;
        options.fromName = options.fromName || settings.defaultFrom;
        options.replyTo = options.replyTo || settings.defaultReplyTo;
        options.text = options.text || settings.text;
        options.html = options.html || settings.html;

        client.transmissions.send(
                {
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
                    {address: options.to}
                  ]
                })
              .then((data: any) => {
                resolve(data);
              })
              .catch((result: any) => {
                const messages = result.errors.map((error: any) => {`${error.code}: ${error.message} - ${error.description}`})
                let err = new Error(messages.join("\n"));
                err.stack = `\nCaused By:\n` + result.stack;
                reject(err);
              });
      });

    },
    // @todo: actually template the emails
    sendTemplatedEmail(
      emailOptions: {
        to: string
        from?: string,
        replyTo?: string,
        cc?: string,
        bcc?: string,
        fromName?: string,
      },
      emailTemplate: {
        text?: string,
        html?: string,
        subject: string,
      },
      data: any
    ) {
      return new Promise((resolve, reject) => {
        emailOptions.from = emailOptions.from || settings.defaultFrom;
        emailOptions.fromName = emailOptions.fromName || settings.defaultFrom;
        emailOptions.replyTo = emailOptions.replyTo || settings.defaultReplyTo;
        emailTemplate.html = emailTemplate.html || settings.html;
        emailTemplate.text = emailTemplate.html || settings.text;

        client.transmissions.send(
                {
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
                    {address: emailOptions.to}
                  ]
                })
              .then((data: any) => {
                resolve(data);
              })
              .catch((result: any) => {
                const messages = result.errors.map((error: any) => {`${error.code}: ${error.message} - ${error.description}`})
                let err = new Error(messages.join("\n"));
                err.stack = `\nCaused By:\n` + result.stack;
                reject(err);
              });
      });

    },
  }
}

