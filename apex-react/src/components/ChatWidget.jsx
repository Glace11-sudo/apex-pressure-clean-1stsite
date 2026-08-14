import { useEffect, useRef, useState } from 'react';
import apexMark from '../assets/apex-mark.png';

const MENUS = {
  main: {
    options: [
      { label: 'Get a free estimate', next: 'estimate' },
      { label: 'What services do you offer?', next: 'services' },
      { label: 'Do you serve my area?', next: 'area' },
      { label: 'Talk to a human', next: 'human' },
    ],
  },
  estimate: {
    message: 'Happy to help. The fastest way is our booking form — tap "Book Now" up top, or I can text you the link. Want me to point you there?',
    options: [
      { label: 'Take me to booking', next: 'bookingRedirect' },
      { label: 'Ask something else', next: 'main' },
    ],
  },
  bookingRedirect: {
    message: 'Scroll down to the "Book Now" section — pick a service, a date, and you’re set. No payment needed up front.',
    options: [],
    scrollToBook: true,
  },
  services: {
    message: 'Three: Power Wash (750+ PSI, great for concrete & commercial), Soft Wash (low-pressure, safe for siding & roofs), and Hybrid Wash — our own blend of both.',
    options: [{ label: 'Back to menu', next: 'main' }],
  },
  area: {
    message: 'We’re based in Prince George’s County and also run routes through Anne Arundel, Montgomery, and Charles Counties, plus Washington, D.C.',
    options: [{ label: 'Back to menu', next: 'main' }],
  },
  human: {
    message: 'Call or text us anytime at 443-351-8124 — that’s the fastest way to reach the team directly.',
    options: [{ label: 'Back to menu', next: 'main' }],
  },
};

const GREETING = 'Hey! 👋 Thanks for stopping by Apex Pressure Clean. I’m a demo assistant — ask me about services, our service area, or how to book a free estimate.';

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [opened, setOpened] = useState(false);
  const [messages, setMessages] = useState([]);
  const [quick, setQuick] = useState([]);
  const [typing, setTyping] = useState(false);
  const logRef = useRef(null);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [messages, typing]);

  function addBubble(text, who) {
    setMessages((m) => [...m, { text, who, key: `${who}-${m.length}-${Date.now()}` }]);
  }

  function showTyping(cb) {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      cb();
    }, 550 + Math.random() * 400);
  }

  function goToScreen(key) {
    const screen = MENUS[key];
    if (screen.message) addBubble(screen.message, 'bot');
    setQuick(screen.options);
    if (screen.scrollToBook) {
      setOpen(false);
      document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  function selectOption(opt) {
    addBubble(opt.label, 'me');
    setQuick([]);
    showTyping(() => goToScreen(opt.next));
  }

  function openChat() {
    setOpen(true);
    if (!opened) {
      setOpened(true);
      showTyping(() => {
        addBubble(GREETING, 'bot');
        setQuick(MENUS.main.options);
      });
    }
  }

  function toggleChat() {
    if (open) setOpen(false);
    else openChat();
  }

  return (
    <>
      <button id="chatLauncher" aria-label="Open chat" aria-expanded={open} onClick={toggleChat}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
        {!open && <span className="chat-badge">1</span>}
      </button>

      <div id="chatPanel" className={open ? 'open' : ''} role="dialog" aria-label="Chat with Apex Pressure Clean">
        <div className="chat-head">
          <img src={apexMark} alt="" />
          <div className="who">
            <b>Apex Pressure Clean</b>
            <div className="status">Typically replies in a few minutes</div>
          </div>
          <button className="close" aria-label="Close chat" onClick={() => setOpen(false)}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="chat-log" ref={logRef}>
          {messages.map((m) => (
            <div className={`bubble ${m.who}`} key={m.key}>{m.text}</div>
          ))}
          {typing && (
            <div className="chat-typing"><span></span><span></span><span></span></div>
          )}
        </div>
        <div className="chat-quick">
          {quick.map((opt) => (
            <button type="button" key={opt.label} onClick={() => selectOption(opt)}>{opt.label}</button>
          ))}
        </div>
      </div>
    </>
  );
}
