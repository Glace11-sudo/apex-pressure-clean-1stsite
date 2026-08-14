import { useMemo, useRef, useState } from 'react';
import { mulberry32 } from '../lib/random';

const DOW = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const SLOT_TIMES = ['8:00 AM', '9:30 AM', '11:00 AM', '12:30 PM', '2:00 PM', '3:30 PM'];
const SERVICES = [
  { value: 'Power Wash', desc: 'High-pressure clean for concrete, brick & commercial surfaces.' },
  { value: 'Soft Wash', desc: 'Low-pressure treatment for siding, roofs & delicate surfaces.' },
  { value: 'Hybrid Wash', desc: 'Our signature blend — not sure what you need? Start here.' },
];

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export default function BookingWizard() {
  const [step, setStep] = useState(1);
  const [service, setService] = useState(null);
  const [date, setDate] = useState(null);
  const [dateLabel, setDateLabel] = useState(null);
  const [time, setTime] = useState(null);
  const [details, setDetails] = useState({ name: '', phone: '', address: '', notes: '' });
  const [confirmed, setConfirmed] = useState(false);

  const today = useMemo(() => startOfToday(), []);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const formRef = useRef(null);

  function pickDate(d) {
    setDate(d);
    setDateLabel(d.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }));
    setTime(null);
  }

  function prevMonth() {
    setViewMonth((m) => {
      if (m === 0) { setViewYear((y) => y - 1); return 11; }
      return m - 1;
    });
  }
  function nextMonth() {
    setViewMonth((m) => {
      if (m === 11) { setViewYear((y) => y + 1); return 0; }
      return m + 1;
    });
  }

  const calendarDays = useMemo(() => {
    const first = new Date(viewYear, viewMonth, 1);
    const startOffset = first.getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < startOffset; i++) cells.push({ pad: true, key: `pad-${i}` });
    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(viewYear, viewMonth, day);
      const isPast = d < today;
      const isSunday = d.getDay() === 0;
      cells.push({
        key: `day-${day}`,
        day,
        date: d,
        past: isPast,
        closed: !isPast && isSunday,
        open: !isPast && !isSunday,
        isToday: d.getTime() === today.getTime(),
        selected: date && d.getTime() === date.getTime(),
      });
    }
    return cells;
  }, [viewYear, viewMonth, today, date]);

  const monthLabel = new Date(viewYear, viewMonth, 1).toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

  const slots = useMemo(() => {
    if (!date) return [];
    const rand = mulberry32(date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate());
    return SLOT_TIMES.map((t) => ({ t, taken: rand() < 0.32 }));
  }, [date]);
  const anyOpenSlot = slots.some((s) => !s.taken);

  function handleDetailChange(e) {
    const { name, value } = e.target;
    setDetails((d) => ({ ...d, [name]: value }));
  }

  function goToConfirm() {
    if (!formRef.current.reportValidity()) return;
    setConfirmed(false);
    setStep(4);
  }

  return (
    <section className="book" id="book">
      <div className="wrap">
        <div className="section-head">
          <p className="eyebrow">Book now</p>
          <h2>Get a free, no-pressure estimate</h2>
          <p>Pick a service and a time that works. We&rsquo;ll confirm the details and follow up before we head out.</p>
        </div>

        <div className="book-panel">
          <div className="book-steps" id="bookSteps">
            {[
              { n: 1, label: 'Service' },
              { n: 2, label: 'Date & time' },
              { n: 3, label: 'Your info' },
              { n: 4, label: 'Confirm' },
            ].map((s) => (
              <div
                className={`bstep${step === s.n ? ' active' : ''}${step > s.n ? ' done' : ''}`}
                data-step={s.n}
                key={s.n}
              >
                <span className="n">{s.n}</span>{s.label}
              </div>
            ))}
          </div>

          <div className="book-body">
            {/* Step 1: service */}
            <div className={`bpane${step === 1 ? ' active' : ''}`} data-pane="1">
              <div className="service-pick" id="servicePick">
                {SERVICES.map((s) => (
                  <label key={s.value}>
                    <input
                      type="radio"
                      name="svc"
                      value={s.value}
                      checked={service === s.value}
                      onChange={() => setService(s.value)}
                    />
                    <span className="name">{s.value}</span>
                    <span className="desc">{s.desc}</span>
                  </label>
                ))}
              </div>
              <div className="book-actions">
                <span></span>
                <button className="btn btn-primary" disabled={!service} onClick={() => setStep(2)}>Continue</button>
              </div>
            </div>

            {/* Step 2: date/time */}
            <div className={`bpane${step === 2 ? ' active' : ''}`} data-pane="2">
              <div className="cal-wrap">
                <div>
                  <div className="cal-head">
                    <div className="cal-nav"><button type="button" aria-label="Previous month" onClick={prevMonth}>&#8249;</button></div>
                    <div className="month">{monthLabel}</div>
                    <div className="cal-nav"><button type="button" aria-label="Next month" onClick={nextMonth}>&#8250;</button></div>
                  </div>
                  <div className="cal-grid">
                    {DOW.map((d) => <div className="cal-dow" key={d}>{d}</div>)}
                    {calendarDays.map((c) => c.pad ? (
                      <div className="cal-day muted" key={c.key}></div>
                    ) : (
                      <button
                        type="button"
                        key={c.key}
                        className={`cal-day${c.past ? ' past' : ''}${c.closed ? ' closed' : ''}${c.open ? ' open' : ''}${c.isToday ? ' today' : ''}${c.selected ? ' selected' : ''}`}
                        disabled={c.past || c.closed}
                        onClick={() => pickDate(c.date)}
                      >
                        {c.day}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="slots">
                  <div className="slots-label">{date ? `Open times — ${dateLabel}` : 'Pick a date to see open times'}</div>
                  <div className="slot-grid">
                    {date && !anyOpenSlot && (
                      <div className="slots-empty">Fully booked that day — try another date.</div>
                    )}
                    {date && slots.map((s) => (
                      <button
                        type="button"
                        key={s.t}
                        className={`slot-btn${time === s.t ? ' selected' : ''}`}
                        disabled={s.taken}
                        onClick={() => setTime(s.t)}
                      >
                        {s.t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="book-actions">
                <button className="btn btn-ghost" onClick={() => setStep(1)}>Back</button>
                <button className="btn btn-primary" disabled={!time} onClick={() => setStep(3)}>Continue</button>
              </div>
            </div>

            {/* Step 3: details */}
            <div className={`bpane${step === 3 ? ' active' : ''}`} data-pane="3">
              <form className="detail-form" ref={formRef} onSubmit={(e) => e.preventDefault()}>
                <div className="form-row">
                  <label className="field">Name
                    <input type="text" name="name" required placeholder="Jane Rivera" value={details.name} onChange={handleDetailChange} />
                  </label>
                  <label className="field">Phone
                    <input type="tel" name="phone" required placeholder="(443) 000-0000" value={details.phone} onChange={handleDetailChange} />
                  </label>
                </div>
                <label className="field">Service address
                  <input type="text" name="address" required placeholder="1400 Maple St, Bowie, MD" value={details.address} onChange={handleDetailChange} />
                </label>
                <label className="field">Anything we should know?
                  <textarea name="notes" placeholder="Oil stains near the garage, two-car driveway..." value={details.notes} onChange={handleDetailChange}></textarea>
                </label>
              </form>
              <div className="book-actions">
                <button className="btn btn-ghost" onClick={() => setStep(2)}>Back</button>
                <button className="btn btn-primary" onClick={goToConfirm}>Review &amp; confirm</button>
              </div>
            </div>

            {/* Step 4: confirm */}
            <div className={`bpane${step === 4 ? ' active' : ''}`} data-pane="4">
              {!confirmed && (
                <div className="summary-card">
                  <dl>
                    <dt>Service</dt><dd>{service}</dd>
                    <dt>When</dt><dd>{dateLabel} &middot; {time}</dd>
                    <dt>Name</dt><dd>{details.name}</dd>
                    <dt>Phone</dt><dd>{details.phone}</dd>
                    <dt>Address</dt><dd>{details.address}</dd>
                    {details.notes && (<><dt>Notes</dt><dd>{details.notes}</dd></>)}
                  </dl>
                </div>
              )}
              {confirmed && (
                <div className="confirm">
                  <div className="checkmark">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                  </div>
                  <h3>Estimate requested</h3>
                  <p>
                    This is a demo booking flow — no request was actually sent. On the live site we&rsquo;d text{' '}
                    {details.phone || 'you'} to confirm {dateLabel} at {time}.
                  </p>
                </div>
              )}
              <div className="book-actions">
                {!confirmed && (
                  <>
                    <button className="btn btn-ghost" onClick={() => setStep(3)}>Back</button>
                    <button className="btn btn-primary" onClick={() => setConfirmed(true)}>Confirm request</button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
