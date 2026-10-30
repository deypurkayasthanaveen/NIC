import { useEffect } from 'react'
import { X, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react'

export type PolicyType = 'privacy' | 'terms' | 'accessibility' | null

interface PolicyModalProps {
  type: PolicyType
  onClose: () => void
}

const policyData: Record<
  NonNullable<PolicyType>,
  { title: string; subtitle: string; icon: typeof ShieldCheck; content: string[] }
> = {
  privacy: {
    title: 'Privacy Policy',
    subtitle: 'National Informatics Centre (NIC) & MeitY Guidelines',
    icon: ShieldCheck,
    content: [
      'This portal complies with the Guidelines for Indian Government Websites (GIGW) and does not automatically capture any specific personal information (like name, phone number, or e-mail address) that allows us to identify you individually.',
      'If the portal requests personal information, you will be informed about the particular purposes for which the information is gathered and adequate security measures will be taken to protect your personal information.',
      'We do not sell or share any personally identifiable information volunteered on this portal site to any third party (public/private). Any information provided will be protected from loss, misuse, unauthorized access or disclosure, alteration, or destruction.',
      'Standard access log data (IP address, browser type, date and time of access) is gathered solely for security audits and administrative telemetry.',
    ],
  },
  terms: {
    title: 'Terms & Conditions',
    subtitle: 'Government of India Portal Usage Agreement',
    icon: FileText,
    content: [
      'This website is designed, developed, and maintained by the National Informatics Centre (NIC), Ministry of Electronics & Information Technology, Government of India.',
      'Though all efforts have been made to ensure the accuracy and currency of the content on this website, the same should not be construed as a statement of law or used for any legal purposes.',
      'In no event will the Government of India or NIC be liable for any expense, loss or damage including, without limitation, indirect or consequential loss or damage, arising from the use of data or loss of use.',
      'These terms and conditions shall be governed by and construed in accordance with the Indian Laws. Any dispute arising under these terms and conditions shall be subject to the jurisdiction of the courts of India.',
    ],
  },
  accessibility: {
    title: 'Accessibility Statement',
    subtitle: 'Commitment to Inclusive Digital Governance (GIGW / WCAG 2.1 AA)',
    icon: CheckCircle2,
    content: [
      'We are committed to ensuring that this portal is accessible to all users irrespective of device in use, technology, or ability. It has been built with an aim to provide maximum accessibility and usability to its visitors.',
      'As a result, this portal can be viewed from a variety of devices such as Desktop / Laptop computers, web-enabled mobile devices, and screen readers.',
      'We have adhered to the Guidelines for Indian Government Websites (GIGW) and Web Content Accessibility Guidelines (WCAG) 2.1 Level AA recommendations to facilitate keyboard-only navigation, high contrast legibility, and assistive technology support.',
      'If you have any difficulty in accessing any part of this website, please write to the webmaster with details of the page along with your browser and assistive technology environment.',
    ],
  },
}

export function PolicyModal({ type, onClose }: PolicyModalProps) {
  useEffect(() => {
    if (!type) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [type, onClose])

  if (!type) return null

  const info = policyData[type]
  const Icon = info.icon

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="policy-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900 text-slate-100 shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/90 px-6 py-4.5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h3 id="policy-modal-title" className="text-lg font-semibold text-white tracking-tight">
                {info.title}
              </h3>
              <p className="text-xs text-slate-400">{info.subtitle}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[60vh] overflow-y-auto px-6 py-5 space-y-4 text-sm leading-relaxed text-slate-300">
          {info.content.map((paragraph, idx) => (
            <p key={idx} className="bg-slate-800/40 p-3.5 rounded-lg border border-slate-800/60">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-800 bg-slate-950/50 px-6 py-3.5">
          <span className="text-xs text-slate-400">National Informatics Centre • Government of India</span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow transition-colors hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
