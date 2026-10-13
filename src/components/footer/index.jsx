import { FiCoffee, FiFacebook, FiGithub, FiGlobe, FiHeart, FiLinkedin, FiMail, FiPenTool, FiYoutube } from "react-icons/fi";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import styles from "./styles.module.css";

const socialLinks = [
  { label: "Portfolio", href: "https://www.ashishranjan.net", domain: "ashishranjan.net", Icon: FiGlobe },
  { label: "GitHub", href: "https://github.com/a2rp", domain: "github.com/a2rp", Icon: FiGithub },
  { label: "CodePen", href: "https://codepen.io/ash1198", domain: "codepen.io/ash1198", Icon: FiPenTool },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/aashishranjan", domain: "linkedin.com/in/aashishranjan", Icon: FiLinkedin },
  { label: "Facebook", href: "https://www.facebook.com/theash.ashish/", domain: "facebook.com/theash.ashish", Icon: FiFacebook },
  { label: "YouTube", href: "https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1", domain: "youtube.com/@ashishranjan-ashz", Icon: FiYoutube },
  { label: "Email", href: "mailto:ash.ranjan09@gmail.com", domain: "ash.ranjan09@gmail.com", Icon: FiMail },
  { label: "Support", href: "https://a2rp-donation-page.netlify.app/", domain: "a2rp-donation-page.netlify.app", Icon: FiHeart },
  { label: "Buy Me a Coffee", href: "https://buymeacoffee.com/ashishranjan", domain: "buymeacoffee.com/ashishranjan", Icon: FiCoffee },
  { label: "Patreon", href: "https://www.patreon.com/ashishranjan", domain: "patreon.com/ashishranjan", Icon: FiHeart },
  { label: "Source code", href: "https://github.com/a2rp/school-information-system", domain: "github.com/a2rp/school-information-system", Icon: FiGithub },
];

const Footer = () => (
  <footer className={styles.footer}>
    <div className={styles.footerInner}>
      <div className={styles.copyright}>
        <a className={styles.logoLink} href="https://www.ashishranjan.net" aria-label="Ashish Ranjan portfolio">
          <img src={`${import.meta.env.BASE_URL}logo.png`} alt="Ashish Ranjan logo" />
        </a>
        <p>© {new Date().getFullYear()} <a href="https://www.ashishranjan.net">Ashish Ranjan</a>. All rights reserved.</p>
      </div>
      <div className={styles.socialLinks} aria-label="Links and support">
        {socialLinks.map(({ label, href, domain, Icon }) => (
          <a key={label} href={href} target={href.startsWith("mailto:") ? undefined : "_blank"} rel={href.startsWith("mailto:") ? undefined : "noreferrer"} aria-label={`${label}: ${domain}`} data-tooltip-id="school-footer-tooltip" data-tooltip-content={`${label}\n${domain}`}>
            <Icon aria-hidden="true" />
          </a>
        ))}
      </div>
    </div>
    <Tooltip id="school-footer-tooltip" place="top" className={styles.tooltip} />
  </footer>
);

export default Footer;
