import nodemailer from "nodemailer";

export const sendEmail = async (options: { email: string; subject: string; message: string }) => {
    // For development, use Mailtrap or any SMTP provider
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    const mailOptions = {
        from: `Safe-Tenant SaaS <noreply@safetenant.com>`,
        to: options.email,
        subject: options.subject,
        html: options.message,
    };

    await transporter.sendMail(mailOptions);
};