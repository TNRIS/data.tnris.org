export function PricingSummary() {
  return (
    <div>
      <p>
        Final cost for your order depends on many variables including hardware,
        staff time, computer time, data size, etc. TNRIS will contact you with
        the final, calculated cost. For a general estimate of your order, please
        take a look at the following prices:
      </p>

      <h4>Historical Imagery Costs</h4>
      <ul>
        <li>Research:</li>
        <ul>
          <li>Full Historical Search (multiple years or sites): $60.00</li>
          <li>Single Year Search (one site and one year): $30.00</li>
          <li>
            Frame Search (customer must be able to identify specific frames
            needed): $15.00
          </li>
        </ul>
        <li>Imagery:</li>
        <ul>
          <li>Scanned Historical Frame: $10.00 per image</li>
          <li>Scanned + Georeferenced Historical Frame: $20.00 per image</li>
        </ul>
      </ul>
      <h4>Bulk Collection Delivery Option</h4>
      <p>
        Customers have the option of ordering any collection that has already
        been scanned in full for the data size price (see Data Reproduction
        Costs), rather than paying by frame.
      </p>
      <ul>
        <li>Staff Time: $46.00 per TB</li>
        <li>Server/Computer Time: $0.15 per GB</li>
      </ul>
      <h4>Delivery Options and Policy</h4>
      <p>
        TNRIS requests 3-10 business days for data requests and product turn
        around. We do not accommodate any expedited orders.
      </p>
      <ul>
        <li>Digital Download Delivery (0-10 GB): $7.00</li>
        <li>TNRIS provided USB flash drive (64 GB): $40.00</li>
        <li>TNRIS provided external hard drive (1 TB): $100.00</li>
      </ul>
    </div>
  );
}
