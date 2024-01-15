import sendgrid from '@sendgrid/mail';

export default class Email {
  user: string;
  url: string;
  from: string;

  constructor(user: string, url = '') {
    this.user = user;
    this.url = url;
    this.from = process.env.EMAIL_FROM!;

    sendgrid.setApiKey(process.env.SENDGRID_API_KEY!);
  }

  async send(subject: string, message: string) {
    const options = {
      to: this.user,
      from: this.from,
      subject: subject,
      text: message,
    };

    await sendgrid.send(options);
  }

  async sendWelcome() {
    await this.send(
      'Welcome to the So-Yummy family!',
      `Before you start finding recipes from all over the world, you need to verify your email address first! Click on the link below to verify your email address: ${this.url}`
    );
  }

  async sendPasswordResetToken() {
    await this.send(
      'So-Yummy - reset password (10 min)',
      `Click on the link below to reset your password: ${this.url} - just copy the token for now - form need to be done here.`
    );
  }
}
