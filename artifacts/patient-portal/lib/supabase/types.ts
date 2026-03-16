export type UserRole = 'patient' | 'admin'

export type MembershipTier = 'tier_1' | 'tier_2'
export type MembershipStatus = 'active' | 'cancelled' | 'past_due' | 'paused'
export type AppointmentType = 'new_patient' | 'follow_up' | 'discovery'
export type AppointmentStatus = 'confirmed' | 'cancelled' | 'completed' | 'no_show'
export type AppointmentFormat = 'in_person' | 'video'
export type DocumentType = 'lab_result' | 'patient_upload' | 'food_diary' | 'intake_form'
export type ConversationStatus = 'active' | 'resolved' | 'needs_followup'
export type FoodDiaryStatus = 'in_progress' | 'completed'
export type MealType = 'breakfast' | 'snack_1' | 'lunch' | 'snack_2' | 'dinner' | 'snack_3' | 'drinks'
export type LocationType = 'at_home' | 'restaurant' | 'takeaway' | 'at_desk' | 'other'
export type LabProvider = 'tdl' | 'gutid' | 'teamgene'

export interface Profile {
  id: string
  full_name: string | null
  phone: string | null
  address: string | null
  date_of_birth: string | null
  role: UserRole
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Membership {
  id: string
  user_id: string
  tier: MembershipTier
  status: MembershipStatus
  stripe_subscription_id: string | null
  stripe_customer_id: string | null
  current_period_start: string | null
  current_period_end: string | null
  cancel_at: string | null
  minimum_commitment_end: string | null
  credits_total: number
  credits_used: number
  created_at: string
  updated_at: string
}

export interface Appointment {
  id: string
  patient_id: string
  cal_booking_id: string | null
  appointment_type: AppointmentType
  date: string
  start_time: string
  end_time: string
  format: AppointmentFormat
  status: AppointmentStatus
  stripe_payment_intent_id: string | null
  used_membership_credit: boolean
  admin_notes: string | null
  cancellation_reason: string | null
  created_at: string
  updated_at: string
}

export interface IntakeForm {
  id: string
  patient_id: string
  full_name: string
  date_of_birth: string
  address: string
  email: string
  phone: string
  emergency_contact_name: string
  emergency_contact_phone: string
  gp_name: string | null
  gp_practice: string | null
  current_medications: string | null
  known_allergies: string | null
  primary_health_concerns: string | null
  consent_terms: boolean
  consent_data_processing: boolean
  consent_gp_disclaimer: boolean
  completed_at: string | null
  created_at: string
  updated_at: string
}

export interface FoodDiary {
  id: string
  patient_id: string
  start_date: string
  status: FoodDiaryStatus
  completed_at: string | null
  created_at: string
  updated_at: string
}

export interface FoodDiaryEntry {
  id: string
  food_diary_id: string
  day_number: number
  meal_type: MealType
  time: string | null
  description: string | null
  volume: string | null
  location: LocationType | null
  symptoms: string | null
  created_at: string
  updated_at: string
}

export interface Conversation {
  id: string
  patient_id: string
  status: ConversationStatus
  last_message_at: string | null
  unread_count_admin: number
  unread_count_patient: number
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  body: string
  attachments: Record<string, unknown>[] | null
  read_at: string | null
  created_at: string
}

export interface Document {
  id: string
  patient_id: string
  uploaded_by: string
  type: DocumentType
  file_name: string
  storage_path: string
  file_size: number | null
  mime_type: string | null
  notes: string | null
  lab_provider: LabProvider | null
  created_at: string
}

export interface SupplementCatalogue {
  id: string
  name: string
  brand: string | null
  default_dosage: string | null
  purchase_url: string | null
  discount_code: string | null
  notes: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface PatientSupplement {
  id: string
  patient_id: string
  supplement_id: string
  custom_dosage: string | null
  custom_notes: string | null
  prescribed_at: string
  prescribed_by: string
  is_active: boolean
  created_at: string
}
