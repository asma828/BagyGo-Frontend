import { Component, OnInit, signal, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './landing.html',
  styleUrls: ['./landing.scss']
})
export class LandingComponent implements OnInit {
  scrolled    = signal(false);
  activeStep  = signal(0);
  activeFaq   = signal<number | null>(null);

  stats = [
    { value: '12K+', label: 'Packages delivered' },
    { value: '3.4K+', label: 'Active transporters' },
    { value: '98%',   label: 'Delivery success rate' },
    { value: '4.9★',  label: 'Average rating' },
  ];

  howItWorksSender = [
    { icon: '', title: 'Post your request',      desc: 'Tell us where your bag needs to go, when, and how much you\'re willing to pay.' },
    { icon: '', title: 'Receive offers',          desc: 'Verified transporters who are already making that trip will contact you with their best prices.' },
    { icon: '', title: 'Accept & track',          desc: 'Pick the best offer, pay securely, and track your baggage in real time.' },
  ];

  howItWorksTransporter = [
    { icon: '', title: 'Post your trip',          desc: 'Tell us your route, departure date and how much space you have available.' },
    { icon: '', title: 'Browse & make offers',    desc: 'Browse baggage requests that match your route and make competitive offers.' },
    { icon: '', title: 'Deliver & get paid',      desc: 'Complete the delivery, collect your rating, and get paid instantly.' },
  ];

  testimonials = [
    {
      name: 'Yassine B.',
      city: 'Casablanca',
      role: 'Expéditeur',
      text: 'I sent a suitcase to my parents in Marrakech for half the price of a courier service. The transporter was punctual and professional.',
      rating: 5,
      avatar: 'YB',
      gradient: 'linear-gradient(135deg, #FF6B35, #FFD166)'
    },
    {
      name: 'Sara M.',
      city: 'Rabat',
      role: 'Transporteur',
      text: 'I travel to Agadir every weekend for work. BagyGo lets me earn extra money by carrying bags for others on trips I\'m already making.',
      rating: 5,
      avatar: 'SM',
      gradient: 'linear-gradient(135deg, #2EC4B6, #4FD8CC)'
    },
    {
      name: 'Karim T.',
      city: 'Fès',
      role: 'Expéditeur',
      text: 'The negotiation feature is great — I countered an offer and we settled on a price that worked for both of us. 10/10 experience.',
      rating: 5,
      avatar: 'KT',
      gradient: 'linear-gradient(135deg, #667eea, #764ba2)'
    },
  ];

  faqs = [
    { q: 'Is BagyGo safe?',
      a: 'All transporters are verified with ID checks and rating systems. Every transaction is logged and protected.' },
    { q: 'What can I send?',
      a: 'Personal luggage, gifts, documents, small parcels. Prohibited items include anything illegal, perishables, and items over 100kg.' },
    { q: 'How is payment handled?',
      a: 'Payment is held in escrow and only released to the transporter once you confirm delivery.' },
    { q: 'What if my bag is lost or damaged?',
      a: 'All trips are covered by our delivery protection. File a claim in the app and we handle it within 48 hours.' },
    { q: 'Can I track my baggage in real time?',
      a: 'Yes — once a trip is confirmed, you get live GPS tracking until the bag is delivered to your door.' },
  ];

  cities = [
    'Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger',
    'Agadir', 'Meknès', 'Oujda', 'Tétouan', 'Nador'
  ];

  activeTab = signal<'sender' | 'transporter'>('sender');

  ngOnInit() {
    // Animate stat counter steps
    setInterval(() => {
      this.activeStep.update(s => (s + 1) % 3);
    }, 2800);
  }

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled.set(window.scrollY > 60);
  }

  toggleFaq(i: number) {
    this.activeFaq.update(v => v === i ? null : i);
  }

  get howItWorks() {
    return this.activeTab() === 'sender'
      ? this.howItWorksSender
      : this.howItWorksTransporter;
  }
}