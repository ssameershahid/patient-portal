export const APPOINTMENT_TYPES = {
  new_patient: {
    name: 'New Patient Consultation',
    duration: 60,
    pricePence: 22000,
    priceDisplay: '£220',
    description: 'Comprehensive first consultation including full medical & nutritional assessment',
  },
  follow_up: {
    name: 'Follow-Up Consultation',
    duration: 45,
    pricePence: 19500,
    priceDisplay: '£195',
    description: 'Follow-up discussion including review of test results and progress',
  },
  discovery: {
    name: 'Free Discovery Call',
    duration: 15,
    pricePence: 0,
    priceDisplay: 'Free',
    description: 'A brief introductory call to discuss whether we are a good fit',
  },
} as const

export const MEMBERSHIP_TIERS = {
  tier_1: {
    name: 'Essential',
    pricePence: 42000,
    priceDisplay: '£420/month',
    consultationsPerMonth: 2,
    minimumMonths: 3,
    features: [
      '2 consultations per month',
      'Direct messaging with Dr Sarah',
      'Priority booking',
    ],
  },
  tier_2: {
    name: 'Premium',
    pricePence: 81000,
    priceDisplay: '£810/month',
    consultationsPerMonth: 4,
    minimumMonths: 3,
    features: [
      '4 consultations per month (weekly)',
      'Direct messaging with Dr Sarah',
      'Priority booking',
      'Extended consultation time',
    ],
  },
} as const

export const CLINIC_INFO = {
  name: 'Pulse & Function',
  address: '52 Queen Anne Street, SameDay Doctor, London, W1G 8HL',
  email: 'hello@pulseandfunction.com',
  doctorName: 'Dr Sarah Al-Temimi',
  credentials: 'MBBS BSc MSc(SEM) DipNutr(CNM) AFMCP',
} as const

export type AppointmentTypeKey = keyof typeof APPOINTMENT_TYPES
export type MembershipTierKey = keyof typeof MEMBERSHIP_TIERS
