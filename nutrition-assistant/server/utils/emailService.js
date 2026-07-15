const { sendEmail } = require('../config/email');
const crypto = require('crypto');

const generateResetToken = () => {
  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
  return { resetToken, resetTokenHash };
};

const sendPasswordResetEmail = async (email, resetToken, resetUrl) => {
  const message = `
    <h2>Password Reset Request</h2>
    <p>You have requested a password reset. Please click the link below to reset your password:</p>
    <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
    <p>This link will expire in 30 minutes.</p>
    <p>If you didn't request this, please ignore this email.</p>
  `;

  await sendEmail(email, 'Password Reset Request', message);
};

const sendWelcomeEmail = async (email, name) => {
  const message = `
    <h2>Welcome to Nutrition Assistant!</h2>
    <p>Hi ${name},</p>
    <p>Your account has been successfully created. Start tracking your nutrition journey today!</p>
    <p>Best regards,<br>Nutrition Assistant Team</p>
  `;

  await sendEmail(email, 'Welcome to Nutrition Assistant', message);
};

const sendDietitianApprovalEmail = async (email, name) => {
  const message = `
    <h2>Dietitian Account Approved</h2>
    <p>Hi ${name},</p>
    <p>Your dietitian account has been approved by our admin. You can now start managing clients and meal plans.</p>
    <p>Best regards,<br>Nutrition Assistant Team</p>
  `;

  await sendEmail(email, 'Dietitian Account Approved', message);
};

const sendMealPlanNotification = async (email, clientName, mealPlanDate) => {
  const message = `
    <h2>New Meal Plan Assigned</h2>
    <p>Hi ${clientName},</p>
    <p>Your dietitian has assigned a new meal plan for ${mealPlanDate}.</p>
    <p>Log in to your account to view the details.</p>
    <p>Best regards,<br>Nutrition Assistant Team</p>
  `;

  await sendEmail(email, 'New Meal Plan Assigned', message);
};

module.exports = {
  generateResetToken,
  sendPasswordResetEmail,
  sendWelcomeEmail,
  sendDietitianApprovalEmail,
  sendMealPlanNotification,
};
