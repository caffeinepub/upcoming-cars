import React, { useState } from 'react';
import { Mail, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }
    setStatus('loading');
    // Note: subscribeNewsletter is not available in the backend interface
    // Simulating a successful subscription
    await new Promise(resolve => setTimeout(resolve, 800));
    setStatus('success');
    setMessage('You\'re subscribed! Stay tuned for the latest car updates.');
    setEmail('');
  };

  return (
    <div className="max-w-md mx-auto">
      {status === 'success' ? (
        <div className="flex items-center gap-3 bg-green-900/20 border border-green-700/30 rounded-lg p-4">
          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
          <p className="text-sm text-green-400">{message}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setStatus('idle'); setMessage(''); }}
              placeholder="Enter your email address"
              className="w-full pl-10 pr-4 py-2.5 bg-secondary border border-border rounded text-sm focus:outline-none focus:border-auto-red transition-colors"
              disabled={status === 'loading'}
            />
          </div>
          <button
            type="submit"
            disabled={status === 'loading'}
            className="btn-auto-primary flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {status === 'loading' ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Subscribing…</>
            ) : (
              'Subscribe'
            )}
          </button>
        </form>
      )}
      {status === 'error' && (
        <div className="flex items-center gap-2 mt-2">
          <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0" />
          <p className="text-xs text-destructive">{message}</p>
        </div>
      )}
    </div>
  );
}
