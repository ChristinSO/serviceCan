import { ContextualBand } from "./contextual-band"
import { FooterMainBand } from "./footer-main-band"
import { SubFooterBand } from "./sub-footer-band"

export function Footer() {
  return (
    <footer className="flex flex-col justify-center">
      <ContextualBand />
      <FooterMainBand />
      <SubFooterBand />
    </footer>
  )
}

export default Footer
