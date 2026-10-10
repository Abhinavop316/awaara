const { Resend } = require("resend");

/**
 * Format string to Title Case (e.g. "abhinav sharma" -> "Abhinav Sharma")
 * @param {string} str
 * @returns {string}
 */
const formatName = (str) => {
  if (!str) return "Traveler";
  return str
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

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
    const formattedName = formatName(name);

    const locationDetails = [city, state].filter(Boolean).join(", ");

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Holiday Enquiry - Awaara</title>
    </head>
    <body style="margin: 0; padding: 24px 12px; background-color: #f6f4ee; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #231f1d; -webkit-font-smoothing: antialiased;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td align="center">
            <!-- Main Card Container -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 580px; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e7e2d8; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);">
              
              <!-- Editorial Header / Masthead -->
              <tr>
                <td style="background-color: #1a1614; padding: 36px 30px; text-align: center;">
                  <div style="font-family: 'Playfair Display', Georgia, 'Times New Roman', serif; font-size: 26px; font-weight: 700; letter-spacing: 4px; color: #FAF6EF; text-transform: uppercase; margin: 0; line-height: 1.2;">
                    AWAARA
                  </div>
                  <div style="font-size: 10.5px; letter-spacing: 2.5px; color: #d97757; text-transform: uppercase; margin-top: 8px; font-weight: 600;">
                    Curated Journeys & Expeditions
                  </div>
                  <div style="width: 36px; height: 1.5px; background-color: #d97757; margin: 16px auto 0;"></div>
                </td>
              </tr>

              <!-- Main Body Content -->
              <tr>
                <td style="padding: 36px 32px 28px;">
                  
                  <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 20px; font-weight: 600; color: #1a1614; margin-bottom: 16px; line-height: 1.3;">
                    Dear ${formattedName},
                  </div>

                  <p style="font-size: 14.5px; line-height: 1.65; color: #4a453f; margin: 0 0 24px 0;">
                    Thank you for your interest in travelling with Awaara. We have received your holiday enquiry for <strong>${placeName}</strong>${locationDetails ? ` (${locationDetails})` : ""}.
                  </p>

                  <!-- Enquiry Details Box -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #faf8f5; border: 1px solid #ebe6dd; border-radius: 6px; margin-bottom: 24px; overflow: hidden;">
                    <tr>
                      <td style="padding: 13px 18px; border-bottom: 1px solid #ebe6dd; background-color: #f3efe8;">
                        <span style="font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #70675d;">
                          Enquiry Details
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 14px 18px;">
                        <table width="100%" cellpadding="6" cellspacing="0" border="0" style="font-size: 13.5px; border-collapse: collapse;">
                          <tr>
                            <td style="color: #7b746a; width: 40%; padding: 8px 0; border-bottom: 1px solid #f0ebe2;">Destination</td>
                            <td style="color: #1a1614; font-weight: 600; text-align: right; padding: 8px 0; border-bottom: 1px solid #f0ebe2;">${placeName}</td>
                          </tr>
                          <tr>
                            <td style="color: #7b746a; padding: 8px 0; border-bottom: 1px solid #f0ebe2;">Travel Window</td>
                            <td style="color: #1a1614; font-weight: 500; text-align: right; padding: 8px 0; border-bottom: 1px solid #f0ebe2;">${timing || "Upcoming Season"}</td>
                          </tr>
                          <tr>
                            <td style="color: #7b746a; padding: 8px 0; border-bottom: 1px solid #f0ebe2;">Travellers</td>
                            <td style="color: #1a1614; font-weight: 500; text-align: right; padding: 8px 0; border-bottom: 1px solid #f0ebe2;">${passengers} Guest${passengers > 1 ? "s" : ""}</td>
                          </tr>
                          <tr>
                            <td style="color: #7b746a; padding: 8px 0; border-bottom: 1px solid #f0ebe2;">Departure / Origin</td>
                            <td style="color: #1a1614; font-weight: 500; text-align: right; padding: 8px 0; border-bottom: 1px solid #f0ebe2;">${departureCity || "Delhi NCR"}</td>
                          </tr>
                          <tr>
                            <td style="color: #7b746a; padding: 8px 0; ${specialRequests ? 'border-bottom: 1px solid #f0ebe2;' : ''}">Suggested Duration</td>
                            <td style="color: #1a1614; font-weight: 500; text-align: right; padding: 8px 0; ${specialRequests ? 'border-bottom: 1px solid #f0ebe2;' : ''}">${duration || "5 Days"}</td>
                          </tr>
                          ${
                            specialRequests
                              ? `
                          <tr>
                            <td style="color: #7b746a; vertical-align: top; padding: 8px 0;">Special Requests</td>
                            <td style="color: #1a1614; font-weight: 500; text-align: right; padding: 8px 0;">${specialRequests}</td>
                          </tr>
                          `
                              : ""
                          }
                        </table>
                      </td>
                    </tr>
                  </table>

                  <!-- Next Steps / Consultation Info -->
                  <div style="border-left: 3px solid #1a1614; padding-left: 16px; margin: 24px 0;">
                    <div style="font-size: 13px; font-weight: 700; color: #1a1614; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px;">
                      What Happens Next
                    </div>
                    <p style="font-size: 13.5px; line-height: 1.6; color: #5a544d; margin: 0;">
                      Our travel curators are reviewing your travel preferences and curating a bespoke itinerary. A dedicated specialist will reach out to you directly on <strong>${phone}</strong> with the proposal and quotation.
                    </p>
                  </div>

                  <p style="font-size: 13px; line-height: 1.6; color: #7b746a; margin: 24px 0 0 0;">
                    If you have additional requirements or wish to share specific preferences, feel free to reply directly to this email.
                  </p>

                  <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #eeebe4;">
                    <div style="font-size: 13px; color: #7b746a;">Warm regards,</div>
                    <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 15px; font-weight: 700; color: #1a1614; margin-top: 4px;">
                      The Awaara Journeys Team
                    </div>
                  </div>

                </td>
              </tr>

              <!-- Clean Luxury Footer -->
              <tr>
                <td style="background-color: #faf8f5; border-top: 1px solid #eeebe4; padding: 22px 30px; text-align: center;">
                  <div style="font-size: 11px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: #8c8275; margin-bottom: 4px;">
                    Awaara Journeys & Expeditions
                  </div>
                  <div style="font-size: 11.5px; color: #a3998c; line-height: 1.5;">
                    Curated journeys for curious, conscious travellers.
                  </div>
                  <div style="font-size: 11px; color: #a3998c; margin-top: 8px;">
                    © ${new Date().getFullYear()} Awaara. All rights reserved.
                  </div>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `;

    const data = await resend.emails.send({
      from: fromEmail,
      to: [email],
      subject: `Enquiry Received: ${placeName} | Awaara`,
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
