import { useState } from 'react';
import apexMark from '../assets/apex-mark.png';

const NAV_LINKS = [
  { href: '#services', label: 'Services' },
  { href: '#process', label: 'Process' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#area', label: 'Service Area' },
  { href: '#reviews', label: 'Reviews' },
  { href: '#book', label: 'Book Now' },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header>
      <div className="wrap nav">
        <a className="brand" href="#top">
          <img src={apexMark} alt="Apex Pressure Clean shark logo" />
          <span className="wordmark">
            <b>Apex Pressure</b>
            <small>Cleaning</small>
          </span>
        </a>
        <nav className={`links${open ? ' open' : ''}`} id="navLinks">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
        </nav>
        <div className="nav-right">
          <a className="phone-link" href="tel:+14433518124">443-351-8124</a>
          <a className="btn btn-primary" href="#book">Book Now</a>
          <button
            className="nav-toggle"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </header>
  );
}
