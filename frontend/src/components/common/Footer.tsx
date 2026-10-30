import { useState } from 'react'
import { Link } from 'react-router-dom'
import meityLogo from '../../assets/logos/meity.png'
import nicLogo from '../../assets/logos/nic.png'
import { PolicyModal, type PolicyType } from './PolicyModal'

const footerLinkClass =
  'text-[15px] leading-8 font-normal !text-[#7FE8D6] no-underline hover:!text-white hover:underline focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-[#10CDB5] focus-visible:outline-offset-2 focus-visible:!shadow-none transition-[text-decoration] duration-150'

export function Footer() {
  const [activePolicy, setActivePolicy] = useState<PolicyType>(null)

  return (
    <>
      <footer className="w-full bg-[#0B3B36] pb-20">
        <div className="mx-auto max-w-[1200px]">
          <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr] gap-5 pt-5 px-6 pb-3.5">
            {/* Column 1 — Brand */}
            <div>
              <div className="mb-2.5 flex items-center gap-2">
                <div
                  className="flex h-[26px] w-[26px] items-center justify-center rounded-[6px] bg-[#10CDB5] text-[13px] font-medium text-[#06322D]"
                  aria-hidden="true"
                >
                  M
                </div>
                <span className="text-[17px] font-medium text-[#F2F8F7]">AuthDesk</span>
              </div>
              <div className="inline-flex items-center gap-3 rounded-[6px] bg-white px-3 py-1.5">
                <img
                  src={nicLogo}
                  alt="National Informatics Centre"
                  className="h-10 w-auto object-contain"
                  loading="lazy"
                />
                <img
                  src={meityLogo}
                  alt="Ministry of Electronics and Information Technology"
                  className="h-10 w-auto object-contain"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Column 2 — Product */}
            <nav aria-label="Product">
              <h2 className="!text-[17px] !font-medium text-[#F2F8F7]">Product</h2>
              <ul className="mt-0 list-none p-0">
                <li>
                  <Link to="/submit-form" className={footerLinkClass}>
                    Register a client
                  </Link>
                </li>
                <li>
                  <Link to="/details" className={footerLinkClass}>
                    Look up details
                  </Link>
                </li>
              </ul>
            </nav>

            {/* Column 3 — Legal */}
            <nav aria-label="Legal">
              <h2 className="!text-[17px] !font-medium text-[#F2F8F7]">Legal</h2>
              <ul className="mt-0 list-none p-0">
                <li>
                  <a
                    href="#privacy-policy"
                    onClick={(e) => {
                      e.preventDefault()
                      setActivePolicy('privacy')
                    }}
                    className={footerLinkClass}
                  >
                    Privacy policy
                  </a>
                </li>
                <li>
                  <a
                    href="#terms-and-conditions"
                    onClick={(e) => {
                      e.preventDefault()
                      setActivePolicy('terms')
                    }}
                    className={footerLinkClass}
                  >
                    Terms and conditions
                  </a>
                </li>
                <li>
                  <a
                    href="#accessibility"
                    onClick={(e) => {
                      e.preventDefault()
                      setActivePolicy('accessibility')
                    }}
                    className={footerLinkClass}
                  >
                    Accessibility
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col gap-1 border-t-[0.5px] border-[#2E6A62] px-6 py-[9px] text-left text-[13px] font-normal text-[#B7D6D0] md:flex-row md:items-center md:justify-between">
            <p>© 2026 National Informatics Centre, Govt. of India</p>
            <p>Designed and developed by NIC</p>
          </div>
        </div>
      </footer>

      <PolicyModal type={activePolicy} onClose={() => setActivePolicy(null)} />
    </>
  )
}
