import nodemailer, { Transporter } from 'nodemailer';
import { EmailOptions } from "../interface/email.interface";
import path from 'path';
import ejs from 'ejs';
import { SMTP_HOST, SMTP_MAIL, SMTP_PASSWORD, SMTP_SERVICE } from '../config';
import { SMTP_PORT } from '../config/port.config';

export const sendEmail = async(options: EmailOptions): Promise<void> => {
    const transporter: Transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        service: SMTP_SERVICE,
        auth: {
            user: SMTP_MAIL,
            pass: SMTP_PASSWORD

        }
    });
    const { email, subject, template, data } = options;
    // get the path to the email template file
    const templatePath = path.join(__dirname, '../template/email', template);

    //Render the email template  with EJS
    const html: string = await ejs.renderFile(templatePath, data);

    const mailOptions = {
        from: SMTP_MAIL,
        to: email,
        subject, 
        html
    }

    await transporter.sendMail(mailOptions)

}