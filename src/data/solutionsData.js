import { images } from './images';

export const solutions = [
  {
    id: 'sol-1',
    slug: 'energy-storage',
    name: 'Energy Storage Power Plants',
    shortName: 'Energy Storage',
    tagline: 'Store solar energy and dispatch it on demand.',
    description:
      'Containerized and modular energy storage systems that pair with solar generation to deliver reliable power around the clock. Ideal for peak shaving, load shifting, microgrid support, and backup power in commercial and utility applications.',
    image: images.batteryInstall,
    theme: 'dark',
    icon: 'BatteryCharging',
    suitableProductIds: ['p6', 'p7', 'p11'],
    relatedProjectSlugs: ['commercial-office-hybrid', 'farm-solar-storage', 'suburban-rooftop-residential'],
    benefits: [
      'Round-the-clock solar energy utilization with zero grid loss',
      'Peak demand reduction and significant tariff mitigation',
      'Microgrid and instant uninterrupted backup power support',
      'Grid services, automated frequency regulation, and voltage support',
    ],
    architecture: [
      { step: '01', title: 'Solar PV Capture', text: 'Rooftop or ground arrays convert sunlight into clean DC electricity.' },
      { step: '02', title: 'Intelligent Inversion', text: 'Hybrid inverters route energy directly to loads or battery banks.' },
      { step: '03', title: 'Battery Storage', text: 'Surplus energy is preserved in lithium battery banks for evening dispatch.' },
      { step: '04', title: 'Grid Sync & Backup', text: 'Automatic switchover ensures critical loads stay powered during outages.' },
    ],
  },
  {
    id: 'sol-2',
    slug: 'pv-grid-tie',
    name: 'PV Grid-Tie Plants',
    shortName: 'PV Grid-Tie',
    tagline: 'Efficient grid-connected solar generation.',
    description:
      'Grid-tie photovoltaic plants ranging from residential rooftops to multi-megawatt ground-mount installations. Our string and central inverters maximize energy harvest while meeting grid code requirements and offering intelligent monitoring.',
    image: images.farmAerial,
    theme: 'light',
    icon: 'Zap',
    suitableProductIds: ['p3', 'p4', 'p12'],
    relatedProjectSlugs: ['ground-mount-utility-farm', 'commercial-warehouse-rooftop'],
    benefits: [
      'High-yield multi-MPPT string inverter architecture',
      'Full IEEE 1547 and UL 1741 grid-code compliant operation',
      'Centralized cloud telemetry and remote performance analytics',
      'Scalable from 10kW commercial roofs to utility-scale solar farms',
    ],
    architecture: [
      { step: '01', title: 'Array Generation', text: 'High-efficiency mono-crystalline strings harvest irradiance.' },
      { step: '02', title: 'String Inversion', text: 'Three-phase inverters maximize tracking and convert power to AC.' },
      { step: '03', title: 'Grid Injection', text: 'Clean synchronized AC power is fed directly into the site network.' },
      { step: '04', title: 'Cloud Telemetry', text: 'Sensors feed telemetry into the Solar Depot monitoring cloud.' },
    ],
  },
  {
    id: 'sol-3',
    slug: 'micro-inverter-plants',
    name: 'Micro-Inverter Plant Solutions',
    shortName: 'Micro-Inverter',
    tagline: 'Module-level optimization for challenging sites.',
    description:
      'Micro-inverter plant designs that maximize harvest on shaded, multi-orientation, or complex rooftops. Each panel operates independently for the highest resilience and granular module-level monitoring.',
    image: images.installRooftop,
    theme: 'ice',
    icon: 'Grid',
    suitableProductIds: ['p8', 'p12', 'p11'],
    relatedProjectSlugs: ['shaded-rooftop-microinverter'],
    benefits: [
      'Independent module-level MPPT for shaded or multi-angle roofs',
      'Simplified low-voltage AC wiring eliminates high-voltage DC hazards',
      'Rapid shutdown built-in natively per NEC 690.12 code compliance',
      'Granular per-panel performance tracking through mobile app',
    ],
    architecture: [
      { step: '01', title: 'Panel Independent MPPT', text: 'Each module is paired with a dedicated 350W microinverter.' },
      { step: '02', title: 'Zero High-Voltage DC', text: 'Immediate AC conversion at the roof surface eliminates fire risk.' },
      { step: '03', title: 'Trunk Cable Bus', text: 'Parallel AC trunk connects all units to the main distribution panel.' },
      { step: '04', title: 'Module-Level Telemetry', text: 'Individual panel yield metrics streamed via Wi-Fi gateway.' },
    ],
  },
  {
    id: 'sol-4',
    slug: 'residential-solar',
    name: 'Residential Solar Applications',
    shortName: 'Residential',
    tagline: 'Clean, intelligent energy for every home.',
    description:
      'Complete residential solar systems engineered for single-family homes, townhouses, and multi-unit dwellings. Combines efficient inverters, battery storage, and smart monitoring to lower bills and increase energy independence.',
    image: images.suburbanHome,
    theme: 'light',
    icon: 'Home',
    suitableProductIds: ['p1', 'p2', 'p6', 'p9'],
    relatedProjectSlugs: ['suburban-rooftop-residential', 'townhouse-residential'],
    benefits: [
      'Lower monthly electric bills with high self-consumption yield',
      'Sub-10ms battery backup preserves refrigeration and critical circuits',
      'Smart mobile home energy dashboard with real-time solar flow',
      'Aesthetic low-profile inverters with silent natural convection',
    ],
    architecture: [
      { step: '01', title: 'Rooftop Harvest', text: 'Optimized residential modules capture sunrise to sunset light.' },
      { step: '02', title: 'Smart Hybrid Hub', text: 'The 5kW hybrid inverter balances consumption, battery, and grid.' },
      { step: '03', title: 'Self-Consumption', text: 'Home appliances draw solar power first before drawing from grid.' },
      { step: '04', title: 'App Control', text: 'Homeowners control battery reserves and view savings on mobile.' },
    ],
  },
  {
    id: 'sol-5',
    slug: 'commercial-solar',
    name: 'Commercial Solar Applications',
    shortName: 'Commercial',
    tagline: 'Scalable solar for business and industry.',
    description:
      'Commercial and industrial solar solutions for offices, warehouses, factories, and agricultural facilities. Higher-capacity three-phase inverters and energy storage reduce operating costs and support sustainability goals.',
    image: images.industrialRooftop,
    theme: 'dark',
    icon: 'Building2',
    suitableProductIds: ['p4', 'p5', 'p7', 'p10'],
    relatedProjectSlugs: ['commercial-warehouse-rooftop', 'commercial-office-hybrid', 'industrial-rooftop-large'],
    benefits: [
      'Drastically reduce peak demand charges and operational expenses',
      'Automated ESG and corporate carbon accounting export tools',
      'Industrial-grade three-phase string inverters with IP66 protection',
      'Seamless facility EMS / SCADA integration via Modbus protocols',
    ],
    architecture: [
      { step: '01', title: 'Facility Array', text: 'Expansive flat-roof or ground mounts generate high megawattage.' },
      { step: '02', title: 'Three-Phase Inverters', text: '20kW string banks deliver balanced commercial 400V/480V power.' },
      { step: '03', title: 'Peak Demand Shaving', text: 'Smart controls prevent costly utility peak demand tariff spikes.' },
      { step: '04', title: 'Enterprise Portal', text: 'Plant managers track multiple building portfolios in one view.' },
    ],
  },
];

export const getSolutionBySlug = (slug) => solutions.find((s) => s.slug === slug);
export const getSolutionById = (id) => solutions.find((s) => s.id === id);

