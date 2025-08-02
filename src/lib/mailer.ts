import nodemailer from "nodemailer";

const { MAILER_HOST, MAILER_EMAIL, MAILER_EMAIL_PASSWORD } = process.env;

export const transporter = nodemailer.createTransport({
  secure: true,
  port: 465,
  host: MAILER_HOST,
  auth: {
    user: MAILER_EMAIL,
    pass: MAILER_EMAIL_PASSWORD,
  },
});

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
  inquiryType: string;
  subject: string;
  message: string;
}

export const sendContactEmail = async (data: ContactFormData) => {
  const { firstName, lastName, email, company, inquiryType, subject, message } =
    data;

  const mailOptions = {
    from: MAILER_EMAIL,
    to: "contact@muhammadnaeem.me",
    subject: `Contact Form: ${subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #a855f7; border-bottom: 2px solid #f3e8ff; padding-bottom: 10px;">
          New Contact Form Submission
        </h2>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #1a1a1a;">Contact Details</h3>
          <p><strong>Name:</strong> ${firstName} ${lastName}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          ${company ? `<p><strong>Company:</strong> ${company}</p>` : ""}
          <p><strong>Inquiry Type:</strong> ${inquiryType}</p>
        </div>
        
        <div style="background-color: #fff; padding: 20px; border: 1px solid #f1f5f9; border-radius: 8px;">
          <h3 style="margin-top: 0; color: #1a1a1a;">Subject</h3>
          <p style="font-weight: 600;">${subject}</p>
          
          <h3 style="color: #1a1a1a;">Message</h3>
          <p style="line-height: 1.6; white-space: pre-wrap;">${message}</p>
        </div>
        
        <div style="margin-top: 20px; padding: 15px; background-color: #f3e8ff; border-radius: 8px;">
          <p style="margin: 0; font-size: 14px; color: #6b7280;">
            This email was sent from the SmartRec contact form at ${new Date().toLocaleString()}
          </p>
        </div>
      </div>
    `,
    text: `
      New Contact Form Submission
      
      Name: ${firstName} ${lastName}
      Email: ${email}
      ${company ? `Company: ${company}` : ""}
      Inquiry Type: ${inquiryType}
      
      Subject: ${subject}
      
      Message:
      ${message}
      
      Sent at: ${new Date().toLocaleString()}
    `,
  };

  return await transporter.sendMail(mailOptions);
};
