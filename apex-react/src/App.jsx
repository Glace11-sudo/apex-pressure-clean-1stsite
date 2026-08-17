import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import Process from './components/Process';
import Gallery from './components/Gallery';
import ServiceArea from './components/ServiceArea';
import Reviews from './components/Reviews';
import BookingWizard from './components/BookingWizard';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';

export default function App() {
  return (
    <>
      <Header />
      <main id="top">
        <Hero />
        <Services />
        <Process />
        <Gallery />
        <ServiceArea />
        <Reviews />
        <BookingWizard />
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
