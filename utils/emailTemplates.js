// Email template for email verification
export const verificationEmailTemplate = (userName, token) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f4f4f4;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #A456F7 0%, #3D81F6 100%);
          padding: 40px 20px;
          text-align: center;
        }
        .header h1 {
          color: #ffffff;
          margin: 0;
          font-size: 28px;
          font-weight: 600;
        }
        .content {
          padding: 40px 30px;
          color: #333333;
        }
        .content h2 {
          color: #333333;
          font-size: 24px;
          margin-bottom: 20px;
        }
        .content p {
          line-height: 1.6;
          margin-bottom: 20px;
          font-size: 16px;
          color: #555555;
        }
        .button {
          display: inline-block;
          padding: 14px 32px;
          background: linear-gradient(135deg, #A456F7 0%, #3D81F6 100%);
          color: #ffffff;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
          font-size: 16px;
          margin: 20px 0;
          transition: transform 0.2s;
        }
        .button:hover {
          transform: translateY(-2px);
        }
        .footer {
          background-color: #f8f8f8;
          padding: 30px;
          text-align: center;
          border-top: 1px solid #eeeeee;
        }
        .footer p {
          color: #888888;
          font-size: 14px;
          margin: 5px 0;
        }
        .divider {
          height: 1px;
          background: linear-gradient(to right, transparent, #dddddd, transparent);
          margin: 30px 0;
        }
        .warning {
          background-color: #fff3cd;
          border-left: 4px solid #ffc107;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
        }
        .warning p {
          margin: 0;
          color: #856404;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>QuickGPT</h1>
        </div>
        
        <div class="content">
          <h2>Welcome to QuickGPT, ${userName}!</h2>
          
          <p>Thank you for signing up. We're excited to have you on board!</p>
          
          <p>To get started and access all features, please verify your email address by clicking the button below:</p>
          
          <div style="text-align: center;">
            <a href="${verificationUrl}" class="button">Verify Email Address</a>
          </div>
          
          <div class="divider"></div>
          
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #A456F7; font-size: 14px;">${verificationUrl}</p>
          
          <div class="warning">
            <p><strong>Note:</strong> This verification link will expire in 1 hour. If it expires, you'll need to request a new verification email.</p>
          </div>
          
          <p>If you didn't create an account with QuickGPT, please ignore this email.</p>
        </div>
        
        <div class="footer">
          <p><strong>QuickGPT</strong></p>
          <p>Powered by AI, Built for You</p>
          <p style="margin-top: 15px;">© ${new Date().getFullYear()} QuickGPT. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Email template for password reset
export const resetPasswordEmailTemplate = (userName, token) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f4f4f4;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #A456F7 0%, #3D81F6 100%);
          padding: 40px 20px;
          text-align: center;
        }
        .header h1 {
          color: #ffffff;
          margin: 0;
          font-size: 28px;
          font-weight: 600;
        }
        .content {
          padding: 40px 30px;
          color: #333333;
        }
        .content h2 {
          color: #333333;
          font-size: 24px;
          margin-bottom: 20px;
        }
        .content p {
          line-height: 1.6;
          margin-bottom: 20px;
          font-size: 16px;
          color: #555555;
        }
        .button {
          display: inline-block;
          padding: 14px 32px;
          background: linear-gradient(135deg, #A456F7 0%, #3D81F6 100%);
          color: #ffffff;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
          font-size: 16px;
          margin: 20px 0;
          transition: transform 0.2s;
        }
        .button:hover {
          transform: translateY(-2px);
        }
        .footer {
          background-color: #f8f8f8;
          padding: 30px;
          text-align: center;
          border-top: 1px solid #eeeeee;
        }
        .footer p {
          color: #888888;
          font-size: 14px;
          margin: 5px 0;
        }
        .divider {
          height: 1px;
          background: linear-gradient(to right, transparent, #dddddd, transparent);
          margin: 30px 0;
        }
        .warning {
          background-color: #fff3cd;
          border-left: 4px solid #ffc107;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
        }
        .warning p {
          margin: 0;
          color: #856404;
          font-size: 14px;
        }
        .security-notice {
          background-color: #e7f3ff;
          border-left: 4px solid #2196F3;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
        }
        .security-notice p {
          margin: 0;
          color: #004085;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>QuickGPT</h1>
        </div>
        
        <div class="content">
          <h2>Reset Your Password</h2>
          
          <p>Hi ${userName},</p>
          
          <p>We received a request to reset your password for your QuickGPT account. Click the button below to create a new password:</p>
          
          <div style="text-align: center;">
            <a href="${resetUrl}" class="button">Reset Password</a>
          </div>
          
          <div class="divider"></div>
          
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #A456F7; font-size: 14px;">${resetUrl}</p>
          
          <div class="warning">
            <p><strong>Note:</strong> This password reset link will expire in 1 hour for security reasons.</p>
          </div>
          
          <div class="security-notice">
            <p><strong>Security Reminder:</strong> If you didn't request a password reset, please ignore this email. Your password will remain unchanged.</p>
          </div>
          
          <p>For security reasons, never share this link with anyone.</p>
        </div>
        
        <div class="footer">
          <p><strong>QuickGPT</strong></p>
          <p>Powered by AI, Built for You</p>
          <p style="margin-top: 15px;">© ${new Date().getFullYear()} QuickGPT. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Welcome email template (optional - sent after successful verification)
export const welcomeEmailTemplate = (userName) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to QuickGPT</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f4f4f4;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #A456F7 0%, #3D81F6 100%);
          padding: 40px 20px;
          text-align: center;
        }
        .header h1 {
          color: #ffffff;
          margin: 0;
          font-size: 28px;
          font-weight: 600;
        }
        .content {
          padding: 40px 30px;
          color: #333333;
        }
        .content h2 {
          color: #333333;
          font-size: 24px;
          margin-bottom: 20px;
        }
        .content p {
          line-height: 1.6;
          margin-bottom: 20px;
          font-size: 16px;
          color: #555555;
        }
        .feature-box {
          background-color: #f8f9fa;
          border-radius: 6px;
          padding: 20px;
          margin: 20px 0;
        }
        .feature-box h3 {
          color: #A456F7;
          font-size: 18px;
          margin-top: 0;
        }
        .button {
          display: inline-block;
          padding: 14px 32px;
          background: linear-gradient(135deg, #A456F7 0%, #3D81F6 100%);
          color: #ffffff;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
          font-size: 16px;
          margin: 20px 0;
        }
        .footer {
          background-color: #f8f8f8;
          padding: 30px;
          text-align: center;
          border-top: 1px solid #eeeeee;
        }
        .footer p {
          color: #888888;
          font-size: 14px;
          margin: 5px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Welcome to QuickGPT!</h1>
        </div>
        
        <div class="content">
          <h2>You're All Set, ${userName}!</h2>
          
          <p>Your email has been verified successfully. You now have full access to all QuickGPT features.</p>
          
          <div class="feature-box">
            <h3>💎 Your Account Includes:</h3>
            <ul>
              <li>AI-powered conversations</li>
              <li>Image generation capabilities</li>
              <li>Secure chat history</li>
              <li>Community features</li>
            </ul>
          </div>
          
          <p>Ready to get started? Click the button below to begin your AI journey:</p>
          
          <div style="text-align: center;">
            <a href="${process.env.FRONTEND_URL}" class="button">Start Chatting</a>
          </div>
          
          <p>If you have any questions or need assistance, feel free to reach out to our support team.</p>
        </div>
        
        <div class="footer">
          <p><strong>QuickGPT</strong></p>
          <p>Powered by AI, Built for You</p>
          <p style="margin-top: 15px;">© ${new Date().getFullYear()} QuickGPT. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};