const { BrevoClient } = require("@getbrevo/brevo");

const sendEmail = async function (recipientEmail, recipientName, forgotPasswordRequestId) {
    const client = new BrevoClient({
        apiKey: process.env.BREVO_API_KEY,
    });
    await client.transactionalEmails.sendTransacEmail({
        textContent: `Password Reset Link: ${process.env.BASE_URL}/password/reset-password/${forgotPasswordRequestId}`,
        sender: {
            email: process.env.BREVO_SENDER_EMAIL,
            name: "ExpensAI",
        },
        subject: "Password Reset Link",
        to: [
            {
                email: recipientEmail,
                name: recipientName,
            },
        ],
    });
}

module.exports = { sendEmail }


