'use client'

import { Button } from '@/components/ui/button'
import { CLINIC_INFO } from '@/lib/utils/constants'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ExternalLink } from 'lucide-react'

export default function TermsPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-cream-200">
      <header className="border-b border-cream-300 bg-white/60 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <a href="https://pulseandfunction.com" className="text-xl font-bold font-heading text-forest-800">
            {CLINIC_INFO.name}
          </a>
          <Link href="/login" className="text-sm text-forest-600 hover:text-forest-800 font-medium transition-colors">
            Log in &rarr;
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-16">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-forest-600 hover:text-forest-800 font-medium mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="space-y-2 mb-10">
          <h1 className="text-3xl font-bold font-heading text-forest-900">Terms &amp; Conditions</h1>
          <p className="text-sm text-cream-600">Last updated: March 2026</p>
        </div>

        <article className="prose prose-cream max-w-none space-y-8 text-cream-800 leading-relaxed text-[15px]">
          <section className="space-y-4">
            <h2 className="text-xl font-bold font-heading text-forest-900">Important Notice</h2>
            <p>
              Dr Sarah Al-Temimi is a GP and nutritionist. If you suspect you may have an ailment or illness that may require medical attention, it is your responsibility to consult with your regular GP. Dr Sarah Al-Temimi is not acting in place of your regular GP/consultant and will not be prescribing medication or taking on the role of your regular doctor during the nutritional consultations.
            </p>
            <p>
              Dr Sarah Al-Temimi focuses on wellness and prevention of illness. As a certified clinical nutritionist and functional medicine specialist, Dr Sarah Al-Temimi can organise functional medical testing and also educate and motivate clients to assume more personal responsibility for their health by adopting a healthy attitude, lifestyle, and diet.
            </p>
            <p>Dr Sarah Al-Temimi does not promise or guarantee protection from future illness.</p>
            <p>Dr Sarah Al-Temimi will not be held liable for failure to diagnose or treat an illness, nor will she be liable for failure to prevent future illness.</p>
            <p>Any consultation notes and test results are held securely and confidentially.</p>
            <p>By using this service, you confirm that you have given Dr Sarah Al-Temimi a complete and accurate account of any medical conditions that you may have and any medications that you are taking.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold font-heading text-forest-900">Booking &amp; Payment Terms</h2>
            <p>The following terms and conditions apply for all bookings:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>All package bookings must be paid for in advance, in full or in 2&ndash;3 instalments.</li>
              <li>All single appointments &mdash; initial or follow-ups &mdash; must be paid in advance.</li>
              <li>All tests must be paid for in advance.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold font-heading text-forest-900">Cancellations &mdash; In-Person Appointments (52 Queen Anne Street)</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Please notify all cancellations by email (<a href="mailto:hello@pulseandfunction.com" className="text-forest-600 underline">hello@pulseandfunction.com</a>) or through the patient portal messaging as soon as possible.</li>
              <li>Any cancellation or rescheduling of an in-person appointment less than 2 hours prior to the appointment time will incur a 50% charge of the appointment fee. Refunds will be issued within 5 working days.</li>
              <li>An in-person appointment can be rescheduled with no charge only if more than two hours before the original appointment time.</li>
              <li>A non-attendance to a booked in-person appointment will not be refunded.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold font-heading text-forest-900">Cancellations &mdash; Video/Phone Appointments</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Please notify all cancellations by email (<a href="mailto:hello@pulseandfunction.com" className="text-forest-600 underline">hello@pulseandfunction.com</a>) or through the patient portal messaging as soon as possible.</li>
              <li>There are no cancellation fees for cancelling a video/phone appointment at any time. A full refund will be issued within 5 working days.</li>
              <li>A non-attendance to a booked video/phone appointment will not be refunded.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold font-heading text-forest-900">Cancellations &mdash; Membership Plans</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Membership plans have a 3-month minimum commitment period.</li>
              <li>After the initial 3-month period, memberships can be cancelled with 30 days&apos; notice.</li>
              <li>Cancellation within the 3-month minimum period: the membership will remain active until the end of the 3-month term.</li>
              <li>Unused consultation credits do not roll over between billing periods.</li>
              <li>Dr Sarah Al-Temimi has the right to terminate a membership at her sole discretion. Any prepaid services not yet delivered will be refunded.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold font-heading text-forest-900">Refund of Payment for Tests</h2>
            <p>Tests are not refundable under any circumstances.</p>
          </section>
        </article>

        <div className="mt-12 pt-8 border-t border-cream-300">
          <a
            href="https://pulseandfunction.webflow.io/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-forest-600 font-medium hover:text-forest-800 transition-colors"
          >
            View our Privacy Policy
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </main>

      <footer className="border-t border-cream-300 bg-cream-200 mt-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 text-center text-sm text-cream-600">
          <p>{CLINIC_INFO.doctorName} &middot; {CLINIC_INFO.credentials}</p>
          <p className="mt-1">{CLINIC_INFO.address}</p>
        </div>
      </footer>
    </div>
  )
}
