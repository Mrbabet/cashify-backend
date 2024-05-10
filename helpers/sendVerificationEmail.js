const { createMailTransporter } = require("./createMailTransporter");

const sendVerification = (user) => {
  const transporter = createMailTransporter();

  const mailOptions = {
    from: "Your No-Reply Email <no-reply@example.com>", // Sender address
    to: user.email, // Recipient's email address from environment variables
    subject: "Verify your email", // Subject line
    html: `
      <p>Hello user,</p>
      <p>Please verify your email by clicking the link below:</p>
      <a href="${process.env.CLIENT_URL}/auth/verify/${user.verificationToken}">Verify Your Email</a>
    `,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("verification email send");
    }
  });
};

module.exports = { sendVerification };
