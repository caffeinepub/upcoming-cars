import React from 'react';
import { Link } from '@tanstack/react-router';
import { Zap, Heart } from 'lucide-react';
import { SiX, SiFacebook, SiInstagram, SiYoutube } from 'react-icons/si';

const quickLinks = [
  { label: 'Home', path: '/' },
  { label: 'Cars', path: '/cars' },
  { label: 'News', path: '/news' },
  { label: 'Compare', path: '/compare' },
  { label: 'Admin', path: '/admin' },
];

const categories = [
  'EV Market Trends',
  'Petrol vs EV',
  'Government Policies',
  'Launch Announcements',
  'General News',
];

export function Footer() {
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(
    typeof window !== 'undefined' ? window.location.hostname : 'upcoming-cars'
  );

  return (
    <footer className="bg-card border-t border-border mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-auto-red rounded flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="font-heading text-xl font-bold tracking-wider uppercase">
                Upcoming<span className="text-auto-red">Cars</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              India's premier destination for upcoming EV and petrol car news, specs, and launch updates.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a href="#" className="text-muted-foreground hover:text-auto-red transition-colors" aria-label="Twitter/X">
                <SiX className="w-4 h-4" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-auto-red transition-colors" aria-label="Facebook">
                <SiFacebook className="w-4 h-4" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-auto-red transition-colors" aria-label="Instagram">
                <SiInstagram className="w-4 h-4" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-auto-red transition-colors" aria-label="YouTube">
                <SiYoutube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider mb-4 text-auto-red">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider mb-4 text-auto-red">News Categories</h3>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat}>
                  <Link
                    to="/news"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider mb-4 text-auto-red">About</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              Covering the latest in EV and petrol car launches, specs, and automotive industry trends for Indian car enthusiasts.
            </p>
            <p className="text-xs text-muted-foreground">
              Target: Indian car buyers &amp; EV investors
            </p>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {year} UpcomingCars. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-auto-red fill-current" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-auto-red transition-colors underline underline-offset-2"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
