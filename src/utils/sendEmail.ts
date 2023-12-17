import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY || process.exit(1));

export const sendEmail = (url: string, email: string) => {
  const msg = {
    to: email,
    from: 'cash.partner7@gmail.com',
    subject: 'Email verification',
    text: `Verify your email by clicking on the link - ${url}`,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent');
    })
    .catch((error) => {
      console.error(error);
    });
};
