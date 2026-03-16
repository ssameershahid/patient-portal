// TODO: Wire up when Resend credentials are available
// Install: npm install resend

export async function sendEmail(_params: {
  to: string
  subject: string
  html: string
}) {
  // TODO: Replace with real Resend email sending
  console.log('Email placeholder — email not sent:', _params.subject)
  return { success: true }
}

export async function sendAppointmentConfirmation(_params: {
  patientEmail: string
  appointmentDate: string
  appointmentTime: string
  appointmentType: string
}) {
  // TODO: Replace with real email
  console.log('Appointment confirmation email placeholder')
  return { success: true }
}

export async function sendWelcomeEmail(_email: string) {
  // TODO: Replace with real welcome email
  console.log('Welcome email placeholder')
  return { success: true }
}
