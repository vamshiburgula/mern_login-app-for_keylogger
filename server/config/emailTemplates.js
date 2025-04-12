export const EMAIL_VERIFY_TEMPLATE = `
<!DOCTYPE html>
<html>
<head>
  <title>Email Verify</title>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: 'Segoe UI', Roboto, monospace, sans-serif;
      background-color: #0F1117;
      color: #E5E7EB;
    }
    .container {
      width: 100%;
      max-width: 500px;
      margin: 60px auto;
      background-color: #1A1D24;
      border-radius: 8px;
      box-shadow: 0 0 15px rgba(0, 255, 128, 0.2);
      overflow: hidden;
    }
    .content {
      padding: 40px 30px;
    }
    h1 {
      color: #00FF99;
      font-size: 20px;
      margin-bottom: 16px;
    }
    p {
      font-size: 14px;
      line-height: 1.6;
      margin-bottom: 16px;
    }
    .otp-box {
      background-color: #00FF99;
      color: #0F1117;
      padding: 12px 0;
      text-align: center;
      font-weight: bold;
      font-size: 18px;
      letter-spacing: 2px;
      border-radius: 6px;
      font-family: 'Courier New', Courier, monospace;
      margin-bottom: 16px;
    }
    .footer {
      font-size: 12px;
      color: #9CA3AF;
      margin-top: 20px;
    }
    @media only screen and (max-width: 480px) {
      .container {
        width: 90%;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="content">
      <h1>Verify your email</h1>
      <p>You are one step away from securing your account: <span style="color: #60A5FA;">{{email}}</span></p>
      <p>Use the OTP below to verify your account:</p>
      <div class="otp-box">{{otp}}</div>
      <p>This OTP is valid for 24 hours. Do not share this code with anyone.</p>
      <div class="footer">SecureMail System © 2025</div>
    </div>
  </div>
</body>
</html>
`;

export const PASSWORD_RESET_TEMPLATE = `
<!DOCTYPE html>
<html>
<head>
  <title>Password Reset</title>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: 'Segoe UI', Roboto, monospace, sans-serif;
      background-color: #0F1117;
      color: #E5E7EB;
    }
    .container {
      width: 100%;
      max-width: 500px;
      margin: 60px auto;
      background-color: #1A1D24;
      border-radius: 8px;
      box-shadow: 0 0 15px rgba(0, 255, 128, 0.2);
      overflow: hidden;
    }
    .content {
      padding: 40px 30px;
    }
    h1 {
      color: #00FF99;
      font-size: 20px;
      margin-bottom: 16px;
    }
    p {
      font-size: 14px;
      line-height: 1.6;
      margin-bottom: 16px;
    }
    .otp-box {
      background-color: #00FF99;
      color: #0F1117;
      padding: 12px 0;
      text-align: center;
      font-weight: bold;
      font-size: 18px;
      letter-spacing: 2px;
      border-radius: 6px;
      font-family: 'Courier New', Courier, monospace;
      margin-bottom: 16px;
    }
    .footer {
      font-size: 12px;
      color: #9CA3AF;
      margin-top: 20px;
    }
    @media only screen and (max-width: 480px) {
      .container {
        width: 90%;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="content">
      <h1>Password Reset Request</h1>
      <p>We received a password reset request for your account: <span style="color: #60A5FA;">{{email}}</span></p>
      <p>Use the OTP below to reset your password:</p>
      <div class="otp-box">{{otp}}</div>
      <p>This OTP is valid for 15 minutes. If you didn’t request this, ignore this email.</p>
      <div class="footer">SecureMail System © 2025</div>
    </div>
  </div>
</body>
</html>
`;
