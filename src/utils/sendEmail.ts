import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY || process.exit(1));

export const sendEmail = (url: string, email: string) => {
  const msg = {
    to: email,
    from: 'arkadiusz.s.student@gmail.com',
    subject: 'Email verification - So-Yummy',
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
