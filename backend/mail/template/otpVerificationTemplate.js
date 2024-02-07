exports.otpTemplate = (otp) => {
  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <style>
        /* Styles for the email content */
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 20px;
        }
        .otp-code {
          text-align: center;
          font-size: 24px;
          margin-bottom: 20px;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          color: #666666;
          font-size: 14px;
        }
        .company-logo {
          text-align: center;
          margin-bottom: 20px;
        }
        .company-logo img{
          height: 40px;
          width: 170px;
          object-fit: cover; 
          border-radius: .3rem;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <a class="company-logo" href="https://shopy-mart.vercel.app">
            <img
              src="https://i.ibb.co/Rch6tyc/ShopyMart.png"
              alt="Company Logo"
              style="max-width: 200px"
            />
          </a>
          <h2>Welcome to Our Website</h2>
          <p>
            Please use the OTP below to verify your email address and complete
            your signup.
          </p>
        </div>
        <div class="otp-code">
          <strong>Your OTP:</strong> <span style="color: #007bff">{{${otp}}}</span>
        </div>
        <div class="footer">
          <p>
            If you didn't request this OTP, you can safely ignore this email. Your
            account is secure.
          </p>
          <p>&copy; 2024 Your ShopyMart. All rights reserved.</p>
        </div>
      </div>
    </body>
  </html>
  `;
};
