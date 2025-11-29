const nodemailer = require('nodemailer');

let transporter;

const isEmailConfigured = () =>
    process.env.SMTP_HOST &&
    process.env.SMTP_PORT &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS &&
    process.env.EMAIL_FROM;

const getTransporter = () => {
    if (!isEmailConfigured()) {
        return null;
    }

    if (!transporter) {
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
    }

    return transporter;
};

const sendMail = async ({ to, subject, text, html }) => {
    const mailer = getTransporter();

    if (!mailer) {
        console.warn('SMTP credentials missing. Skipping email send.');
        return;
    }

    await mailer.sendMail({
        from: process.env.EMAIL_FROM,
        to,
        subject,
        text,
        html
    });
};

module.exports = {
    sendMail
};

