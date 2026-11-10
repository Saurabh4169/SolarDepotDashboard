export const initialUserProfile = {
  name: 'Alex Morgan',
  title: 'Lead Solar Solutions Engineer',
  email: 'alex.morgan@apexenergy.com',
  phone: '+1 (555) 382-9011',
  company: 'Apex Energy Partners LLC',
  address: '452 Lexington Ave, Floor 14, New York, NY 10017',
  accountTier: 'Verified EPC Partner',
  memberSince: 'March 2023',
  notificationsEnabled: true,
  emailUpdates: true,
  smsAlerts: false,
  preferredUnit: 'kW',
};

export const initialEnquiries = [
  {
    id: 'SDQ-2026-9041',
    date: '2026-11-02',
    type: 'Commercial Solar Systems',
    productOrSolution: 'Commercial Solar Applications (50kW)',
    capacity: '50 kW',
    quantity: '3 units',
    projectType: 'Commercial Rooftop',
    status: 'Quote Prepared',
    statusColor: 'emerald',
    notes: 'Requested technical proposal for warehouse distribution center in New Jersey. Requires 3-phase 480V balance.',
    estimatedResponse: 'Ready for review',
    contact: {
      name: 'Alex Morgan',
      email: 'alex.morgan@apexenergy.com',
      phone: '+1 (555) 382-9011',
    },
  },
  {
    id: 'SDQ-2026-8812',
    date: '2026-10-28',
    type: 'Micro-Inverter Plant Solutions',
    productOrSolution: 'Microinverter 350W (SD-MI-350)',
    capacity: '12 kW',
    quantity: '34 units',
    projectType: 'Residential Multi-Angle Roof',
    status: 'Engineering Review',
    statusColor: 'amber',
    notes: 'Client rooftop has chimney and dormer shading. Looking for module-level rapid shutdown compliance.',
    estimatedResponse: 'Under review by Tech Support',
    contact: {
      name: 'Alex Morgan',
      email: 'alex.morgan@apexenergy.com',
      phone: '+1 (555) 382-9011',
    },
  },
  {
    id: 'SDQ-2026-7920',
    date: '2026-10-12',
    type: 'Product Quote',
    productOrSolution: 'Single-Phase String Inverter 5kW (SD-SP-5K)',
    capacity: '15 kW',
    quantity: '3 units',
    projectType: 'Residential Cluster',
    status: 'Completed',
    statusColor: 'electric',
    notes: 'Specification finalized for Long Island suburban homes cluster project.',
    estimatedResponse: 'Archived project record',
    contact: {
      name: 'Alex Morgan',
      email: 'alex.morgan@apexenergy.com',
      phone: '+1 (555) 382-9011',
    },
  },
];

export const initialNotifications = [
  {
    id: 'n1',
    title: 'New Inverter Released: SD-HY-10K Three-Phase',
    body: 'The next generation 10kW three-phase hybrid inverter with high-voltage battery support is now ready for quotes.',
    time: '25m ago',
    unread: true,
    type: 'product',
    targetRoute: '/products/sd-hybrid-10kw',
  },
  {
    id: 'n2',
    title: 'Commercial Quote SDQ-2026-9041 Prepared',
    body: 'Our engineering desk has prepared the bill-of-materials and preliminary yield report for your commercial proposal.',
    time: '3 hours ago',
    unread: true,
    type: 'quote',
    targetRoute: '/my-enquiries',
  },
  {
    id: 'n3',
    title: 'Firmware Update v3.4.1 for Wi-Fi Dongles',
    body: 'Enhanced telemetry streaming and MQTT protocol encryption is now rolled out across all registered monitoring gateways.',
    time: '1 day ago',
    unread: false,
    type: 'system',
    targetRoute: '/downloads',
  },
  {
    id: 'n4',
    title: 'Welcome to Solar Depot Mobile Portal',
    body: 'Browse high-efficiency string inverters, hybrid storage solutions, compare specs, and request immediate engineering quotes.',
    time: '4 days ago',
    unread: false,
    type: 'welcome',
    targetRoute: '/products',
  },
];

export const solarFaqs = [
  {
    question: 'What warranty is provided on Solar Depot string and hybrid inverters?',
    answer:
      'Standard residential and commercial string inverters carry a 10-year manufacturer warranty, extendable to 15 or 20 years. Microinverters include a 25-year limited warranty, while solar air conditioning units feature a 5-year compressor warranty.',
  },
  {
    question: 'Are Solar Depot inverters certified for North American utility interconnects?',
    answer:
      'Yes. All Solar Depot inverters are certified to UL 1741-SB and IEEE 1547-2018 standards, featuring smart inverter grid-support functions, reactive power control, and rapid shutdown capabilities conforming to NEC 2020/2023 Article 690.12.',
  },
  {
    question: 'How fast is the battery switchover on Solar Depot hybrid inverters during a power blackout?',
    answer:
      'Solar Depot hybrid inverters feature an automated transfer switch (ATS) with a transition time of less than 10 milliseconds (<10ms). This prevents computers, network routers, and refrigeration systems from restarting during grid blackouts.',
  },
  {
    question: 'Can Solar Depot air conditioners run 100% off-grid directly from solar panels?',
    answer:
      'Yes! Solar Depot Solar AC units are equipped with direct high-voltage DC terminals that take power straight from a small array of 3 to 6 PV modules without needing an intermediate DC-AC inverter. AC grid or generator power is automatically tapped only when solar irradiance drops below demand.',
  },
  {
    question: 'How does the mobile monitoring and telemetry portal operate?',
    answer:
      'Each inverter can be connected to the Solar Depot Cloud via the plug-and-play Wi-Fi or 4G LTE dongle. Real-time yield, battery state-of-charge, power flows, and automated error diagnostics are updated at 5-minute intervals.',
  },
];

