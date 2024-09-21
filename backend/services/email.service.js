const nodemailer = require('nodemailer')

class MailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        })
    }

    async sendActivationMail(email, activationLink) {
        await this.transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: `Account Activation`,
            html: `
				<div>
					<a href="${activationLink}">Click here to  activate account</a>
					<a href="${activationLink}">${activationLink}</a>
				</div>
			`,
        })
    }

    async sendForgotPasswordMail(email, activationLink) {
        await this.transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: `Forgot password.`,
            html: `
				<div>
					<h1>Time to hacking. If you want to recover your account just click the link below.</h1>
					<a href="${activationLink}">Link to recovery account</a>

					<b>This link will work during 15 minutes</b>
					<a href="${activationLink}">${activationLink}</a>
				</div>
			`,
        })
    }
}

module.exports = new MailService()