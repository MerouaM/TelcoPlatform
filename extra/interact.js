// Get the deployed contract instance
const sla = await SLA.deployed();

// Store a new SLA
await sla.storeSLA("0xClientAddress", 30, 1622548800, 1625130800, 0);

// Change SLA status
await sla.changeSLAStatus(0, 2); // Change to Accepted
