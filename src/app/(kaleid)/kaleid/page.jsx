import Hero from './Hero';
import Demo from './Demo';
import Features from './Features';
import Effects from './Effects';
import { CrystalMark } from './CrystalMark';

const FIGURES = [
  { count: 92, decimals: 0, suffix: '%', text: 'of answers accepted without a follow-up question.' },
  { count: 1.8, decimals: 1, suffix: ' s', text: 'median time from question to a cited answer.' },
  { count: 14, decimals: 0, suffix: ' h', text: 'saved per person each month on looking things up.' },
];

export default function KaleidPage() {
  return (
    <>
      <Effects />
      <div className="grain" aria-hidden="true" />

      <nav className="nav" aria-label="Main">
        <div className="nav-bar">
          <a className="brand" href="#top">
            <CrystalMark size={22} />
            <span>Kaleid</span>
          </a>
          <ul className="nav-links">
            <li><a href="#product">Product</a></li>
            <li><a href="#why">Why it works</a></li>
            <li><a href="#results">Results</a></li>
            <li><a href="#pricing">Pricing</a></li>
          </ul>
          <div className="nav-end">
            <a className="nav-signin" href="#pricing">Sign in</a>
            <a className="pill pill-primary pill-sm" href="#pricing">Start free</a>
          </div>
        </div>
      </nav>

      <main id="top">
        <Hero />

        <section id="product" className="section demo">
          <span className="disc disc-amber" aria-hidden="true" />
          <span className="disc disc-blue" aria-hidden="true" />
          <div id="demo" className="wrap">
            <Demo />
          </div>
        </section>

        <section id="why" className="section">
          <span className="disc disc-violet" aria-hidden="true" />
          <span className="disc disc-amber disc-low" aria-hidden="true" />
          <div className="wrap">
            <h2 className="h2 reveal">Four reasons it gets used.</h2>
            <Features />
          </div>
        </section>

        <section id="results" className="section">
          <div className="wrap">
            <h2 className="h2 reveal">What changes in a quarter.</h2>
            <dl className="figures">
              {FIGURES.map((f) => (
                <div key={f.text} className="figure reveal">
                  <dt>
                    <span data-count={f.count} data-decimals={f.decimals} data-suffix={f.suffix}>
                      {f.count.toFixed(f.decimals)}
                      {f.suffix}
                    </span>
                  </dt>
                  <dd>{f.text}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section id="pricing" className="section close">
          <span className="close-glow" aria-hidden="true" />
          <div className="wrap close-inner reveal">
            <h2 className="close-title">Stop asking around.</h2>
            <p className="lede">Free for teams of five. Larger teams pay per seat, never per question.</p>
            <div className="close-ctas">
              <a className="pill pill-primary magnetic" href="#top">Start free</a>
              <a className="pill pill-secondary magnetic" href="#top">Book a demo</a>
            </div>
            <p className="fine invented">Kaleid, its customers and every figure on this page are invented for this demo.</p>
          </div>
        </section>
      </main>
    </>
  );
}
