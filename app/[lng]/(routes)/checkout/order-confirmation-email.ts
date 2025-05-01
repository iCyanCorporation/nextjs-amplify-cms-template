// Order confirmation email HTML template as a string.
// Use {{placeholder}} for dynamic values.

const orderConfirmationEmailTemplate = `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Order Confirmation</title>
  </head>
  <body>
    <h2>
      Thank you for your order, {{firstName}} {{lastName}}!
    </h2>
    <h3>Contact Information</h3>
    <ul>
      <li><strong>Email:</strong> {{email}}</li>
      <li><strong>Phone:</strong> {{phone}}</li>
    </ul>
    <h3>Shipping Address</h3>
    <ul>
      <li>
        <strong>Name:</strong> {{firstName}} {{lastName}}
      </li>
      <li><strong>Address:</strong> {{address}}</li>
      <li><strong>City:</strong> {{city}}</li>
      <li><strong>State:</strong> {{state}}</li>
      <li><strong>Postal Code:</strong> {{postalCode}}</li>
      <li><strong>Country:</strong> {{country}}</li>
    </ul>
    <h3>Payment Method</h3>
    <p>{{paymentMethod}}</p>
    <h3>Order Summary</h3>
    <table
      border="1"
      cellpadding="6"
      cellspacing="0"
      style="border-collapse: collapse"
    >
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
    <br />
    <ul>
      <li><strong>Subtotal:</strong> {{subtotal}}</li>
      <li><strong>Shipping:</strong> {{shipping}}</li>
      <li><strong>Tax:</strong> {{tax}}</li>
      <li><strong>Total:</strong> {{total}}</li>
    </ul>
  </body>
</html>
`;

export default orderConfirmationEmailTemplate;
