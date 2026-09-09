import { formatCurrency } from './formatters';

export const downloadTicket = (booking) => {
  const ticketHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Awaara Ticket - ${booking.id}</title>
  <style>
    body {
      font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #faf6ef;
      padding: 40px;
      color: #211d1a;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
    }
    .ticket {
      max-width: 480px;
      width: 100%;
      margin: 0 auto;
      border: 1.5px dashed #ccc;
      border-radius: 14px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(33, 29, 26, 0.10);
      background: #fff;
    }
    .head {
      background: #211d1a;
      color: #faf6ef;
      padding: 20px 24px;
      font-size: 20px;
      font-weight: 700;
      letter-spacing: 0.5px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .head span {
      font-size: 13px;
      font-weight: 500;
      opacity: 0.8;
    }
    .body {
      padding: 24px;
    }
    .row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px dashed #e5e0d8;
      font-size: 14.5px;
    }
    .status {
      color: #69795e;
      font-weight: 700;
      letter-spacing: 0.5px;
      margin-bottom: 14px;
      font-size: 13px;
    }
    .qr {
      width: 80px;
      height: 80px;
      background: repeating-linear-gradient(45deg, #211d1a 0 4px, #fff 4px 8px);
      border-radius: 6px;
      margin-bottom: 18px;
    }
    .footer-note {
      font-size: 12px;
      color: #8a8175;
      margin-top: 20px;
      line-height: 1.5;
    }
  </style>
</head>
<body>
  <div class="ticket">
    <div class="head">
      <div>AWAARA</div>
      <span>BOARDING PASS</span>
    </div>
    <div class="body">
      <div class="qr"></div>
      <p class="status">● BOOKING CONFIRMED</p>
      <div class="row"><span>Booking ID</span><strong>${booking.id}</strong></div>
      <div class="row"><span>Traveler Name</span><span>${booking.name}</span></div>
      <div class="row"><span>Destination</span><span>${booking.trip}</span></div>
      <div class="row"><span>Trip Date</span><span>${booking.dates}</span></div>
      <div class="row"><span>Travelers</span><span>${booking.travelers}</span></div>
      <div class="row"><span>Assigned Seat(s)</span><strong style="color: #0e7033;">${(booking.seats || ['L1']).join(', ')}</strong></div>
      <div class="row"><span>Amount Paid</span><strong>${formatCurrency(booking.amount)}</strong></div>
      <p class="footer-note">Support: support@awaara.demo · This is a digital confirmed prototype ticket.</p>
    </div>
  </div>
</body>
</html>`;

  const blob = new Blob([ticketHtml], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Awaara-Ticket-${booking.id}.html`;
  a.click();
  URL.revokeObjectURL(url);
};
