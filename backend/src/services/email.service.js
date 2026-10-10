const { Resend } = require("resend");

/**
 * Send Holiday Enquiry confirmation email to traveler using Resend API
 * @param {Object} enquiryData
 * @returns {Promise<Object>}
 */
exports.sendEnquiryConfirmationEmail = async (enquiryData) => {
  const {
    name,
    email,
    phone,
    timing,
    passengers,
    departureCity,
    placeName,
    city,
    state,
    duration,
    specialRequests,
  } = enquiryData;

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail =
    process.env.RESEND_FROM_EMAIL || "Awaara Travels <onboarding@resend.dev>";

  if (!apiKey || apiKey.startsWith("re_123456789_your")) {
    console.log(
      `[Resend Mock/Log] RESEND_API_KEY not configured. Would send confirmation email to: ${email} for destination ${placeName}`,
    );
    return {
      success: true,
      status: "Simulated",
      message:
        "Resend API key not configured yet. Simulated email dispatch logged.",
    };
  }

  try {
    const resend = new Resend(apiKey);

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Holiday Enquiry Received - Awaara Group</title>
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f6f3ee; margin: 0; padding: 20px; color: #211d1a; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.06); }
        .header { background: #211d1a; padding: 32px 24px; text-align: center; color: #FAF6EF; }
        .logo { font-size: 26px; font-weight: 800; letter-spacing: 3px; color: #FAF6EF; margin: 0; }
        .tagline { font-size: 11px; letter-spacing: 2px; color: #E0663F; text-transform: uppercase; margin-top: 6px; }
        .content { padding: 32px 28px; }
        .greeting { font-size: 20px; font-weight: 700; color: #211d1a; margin-bottom: 12px; }
        .intro-text { font-size: 15px; line-height: 1.6; color: #4a453f; margin-bottom: 24px; }
        .card { background: #faf6ef; border: 1px solid rgba(224, 102, 63, 0.2); border-radius: 10px; padding: 20px; margin-bottom: 24px; }
        .card-title { font-size: 16px; font-weight: 700; color: #E0663F; margin-top: 0; margin-bottom: 14px; border-bottom: 1px dashed rgba(33,29,26,0.15); padding-bottom: 8px; }
        .detail-row { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px; }
        .detail-label { color: #7b746a; font-weight: 500; }
        .detail-value { color: #211d1a; font-weight: 600; text-align: right; }
        .callout { background: rgba(138, 154, 126, 0.15); border-left: 4px solid #8A9A7E; padding: 14px 18px; border-radius: 6px; font-size: 14px; color: #2c3825; line-height: 1.5; margin-bottom: 24px; }
        .footer { background: #211d1a; padding: 20px; text-align: center; color: rgba(250, 246, 239, 0.6); font-size: 12px; }
        .footer a { color: #E0663F; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 class="logo">AWAARA</h1>
          <div class="tagline">Curated Indian Holidays & Expeditions</div>
        </div>
        
        <div class="content">
          <div class="greeting">Hi ${name},</div>
          <p class="intro-text">
            Thank you for reaching out to <strong>Awaara Group</strong>! We have received your holiday enquiry for <strong>${placeName}</strong> (${city || "India"}, ${state || ""}).
          </p>
          
          <div class="card">
            <div class="card-title">✨ Enquiry Summary</div>
            <table width="100%" cellpadding="6" cellspacing="0" style="border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="color: #7b746a;">Holiday Destination:</td>
                <td style="text-align: right; font-weight: bold; color: #211d1a;">${placeName}</td>
              </tr>
              <tr>
                <td style="color: #7b746a;">Preferred Timing:</td>
                <td style="text-align: right; font-weight: 600;">${timing || "Flexible"}</td>
              </tr>
              <tr>
                <td style="color: #7b746a;">Number of Passengers:</td>
                <td style="text-align: right; font-weight: 600;">${passengers} Traveler(s)</td>
              </tr>
              <tr>
                <td style="color: #7b746a;">Departure / Pickup City:</td>
                <td style="text-align: right; font-weight: 600;">${departureCity || "Delhi NCR"}</td>
              </tr>
              <tr>
                <td style="color: #7b746a;">Recommended Duration:</td>
                <td style="text-align: right; font-weight: 600;">${duration || "5 Days"}</td>
              </tr>
              ${
                specialRequests
                  ? `
              <tr>
                <td style="color: #7b746a; vertical-align: top;">Special Requests:</td>
                <td style="text-align: right; font-weight: 600;">${specialRequests}</td>
              </tr>
              `
                  : ""
              }
            </table>
          </div>

          <div class="callout">
            🌟 <strong>What's Next?</strong><br>
            Our dedicated holiday concierge team is already reviewing your preferences and will get right back to you on <strong>${phone}</strong> and <strong>${email}</strong> with your personalized Day-by-Day travel itinerary, stay options, and quotation!
          </div>

          <p style="font-size: 14px; color: #7b746a; line-height: 1.5;">
            Need immediate help or want to speak with a holiday curator? Reply directly to this email or call our 24x7 support desk.
          </p>

          <p style="font-size: 14px; font-weight: bold; color: #211d1a; margin-top: 24px;">
            Warm regards,<br>
            <span style="color: #E0663F;">The Awaara Group Holidays Team</span>
          </p>
        </div>

        <div class="footer">
          © ${new Date().getFullYear()} Awaara Group. All Rights Reserved.<br>
          <a href="https://awaara.com">www.awaara.com</a> · contact@awaara.com
        </div>
      </div>
    </body>
    </html>
    `;

    const data = await resend.emails.send({
      from: fromEmail,
      to: [email],
      subject: `Awaara Group - We have received your holiday enquiry for ${placeName}!`,
      html: htmlContent,
    });

    return {
      success: true,
      status: "Sent",
      data,
    };
  } catch (error) {
    console.error("Error sending email via Resend API:", error);
    return {
      success: false,
      status: "Failed",
      error: error.message,
    };
  }
};
