// Order confirmation email HTML template as a string.
// Use {{placeholder}} for dynamic values.

const orderConfirmationEmailTemplate = `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Order Confirmation</title>
    <style>
      body {
        font-family: 'Segoe UI', Arial, sans-serif;
        background: #f4f6fb;
        color: #222;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 32px auto;
        background: #fff;
        border-radius: 10px;
        box-shadow: 0 2px 12px rgba(44, 123, 249, 0.08);
        padding: 32px 28px 24px 28px;
      }
      .header {
        text-align: center;
        padding-bottom: 18px;
        border-bottom: 2px solid #e6eaf3;
        margin-bottom: 28px;
      }
      .logo {
        width: 64px;
        margin-bottom: 10px;
      }
      .title {
        color: #2d7ff9;
        font-size: 2rem;
        margin: 0;
      }
      .subtitle {
        color: #444;
        font-size: 1.1rem;
        margin-top: 8px;
        margin-bottom: 0;
      }
      .section-title {
        color: #2d7ff9;
        font-size: 1.1rem;
        margin-top: 28px;
        margin-bottom: 10px;
        border-left: 4px solid #2d7ff9;
        padding-left: 8px;
      }
      ul.info-list {
        list-style: none;
        padding: 0;
        margin: 0 0 12px 0;
      }
      ul.info-list li {
        margin-bottom: 5px;
      }
      .order-table {
        width: 100%;
        background: #f8fafc;
        border-radius: 6px;
        overflow: hidden;
        border-collapse: collapse;
        margin-bottom: 18px;
      }
      .order-table th {
        background: #e6eaf3;
        color: #2d7ff9;
        font-weight: 600;
        padding: 10px 8px;
        border-bottom: 1px solid #dbeafe;
      }
      .order-table td {
        padding: 10px 8px;
        border-bottom: 1px solid #f1f5f9;
      }
      .order-table tr:last-child td {
        border-bottom: none;
      }
      .summary-list {
        list-style: none;
        padding: 0;
        margin: 0 0 18px 0;
      }
      .summary-list li {
        margin-bottom: 6px;
        font-size: 1rem;
      }
      .summary-list .total {
        font-size: 1.15rem;
        font-weight: bold;
        color: #2d7ff9;
        margin-top: 10px;
      }
      .footer {
        text-align: center;
        color: #888;
        font-size: 0.95rem;
        margin-top: 32px;
        border-top: 1px solid #e6eaf3;
        padding-top: 16px;
      }
      .footer a {
        color: #2d7ff9;
        text-decoration: none;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <img class="logo" src="https://dummyimage.com/64x64/2d7ff9/ffffff&text=✓" alt="Order Confirmed" />
        <h1 class="title">Order Confirmed</h1>
        <p class="subtitle">Thank you for your purchase, {{firstName}} {{lastName}}!</p>
      </div>

      <div>
        <div class="section-title">Contact Information</div>
        <ul class="info-list">
          <li><strong>Email:</strong> {{email}}</li>
          <li><strong>Phone:</strong> {{phone}}</li>
        </ul>
      </div>

      <div>
        <div class="section-title">Shipping Address</div>
        <ul class="info-list">
          <li><strong>Name:</strong> {{firstName}} {{lastName}}</li>
          <li><strong>Address:</strong> {{address}}</li>
          <li><strong>City:</strong> {{city}}</li>
          <li><strong>State:</strong> {{state}}</li>
          <li><strong>Postal Code:</strong> {{postalCode}}</li>
          <li><strong>Country:</strong> {{country}}</li>
        </ul>
      </div>

      <div>
        <div class="section-title">Payment Method</div>
        <ul class="info-list">
          <li><strong>Method:</strong> {{paymentMethod}}</li>
          <li>{{paymentMethodValue}}</li>
        </ul>
      </div>

      <div>
        <div class="section-title">Order Summary</div>
        <table class="order-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Attributes</th>
              <th>Unit Price</th>
              <th>Quantity</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {{orderItems}}
          </tbody>
        </table>
        <ul class="summary-list">
          <li><strong>Subtotal:</strong> {{subtotal}}</li>
          <li><strong>Shipping:</strong> {{shipping}}</li>
          <li><strong>Tax:</strong> {{tax}}</li>
          <li class="total"><strong>Total:</strong> {{total}}</li>
        </ul>
      </div>

      <div class="footer">
        If you have any questions, please contact our support team at
        <a href="mailto:{{myEmail}}">{{myEmail}}</a>.<br />
        We appreciate your business!
      </div>
    </div>
  </body>
</html>
`;

export default orderConfirmationEmailTemplate;
