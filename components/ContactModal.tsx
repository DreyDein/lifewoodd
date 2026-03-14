import React, { useState } from 'react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: any;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, t }) => {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitLabel = isSubmitting ? (t?.submitting ?? 'Sending...') : t.send;
  const errorLabel = t?.submitError ?? 'Submission failed. Please try again.';

  if (!isOpen) return null;

  const handleClose = () => {
    setSubmitted(false);
    setError(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    setError(null);
    setIsSubmitting(true);
    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
      const payload = Object.fromEntries(formData.entries());

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || 'Submission failed.');
      }

      setSubmitted(true);
      form.reset();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Submission failed.';
      setError(message || errorLabel);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[210] flex items-center justify-center p-4 bg-lifewood-dark/45 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-[2rem] border border-lifewood-paper/30 bg-lifewood-seaSalt p-8 shadow-2xl dark:border-lifewood-paper/20 dark:bg-lifewood-dark/95">
        <button
          onClick={handleClose}
          aria-label={t.closeButton}
          className="absolute right-5 top-5 text-lifewood-dark/70 transition hover:text-lifewood-dark dark:text-lifewood-seaSalt/70 dark:hover:text-lifewood-seaSalt"
        >
          <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {submitted && (
          <div className="mb-5 rounded-xl border border-lifewood-green/30 bg-lifewood-green/10 px-4 py-3 text-sm font-semibold text-lifewood-green dark:border-lifewood-saffron/50 dark:bg-lifewood-saffron/10 dark:text-lifewood-saffron">
            {t.successMessage}
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-xl border border-red-400/40 bg-red-400/10 px-4 py-3 text-sm font-semibold text-red-500">
            {error || errorLabel}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              type="text"
              name="fullName"
              required
              placeholder={t.fullName}
              className="w-full rounded-2xl border border-lifewood-paper bg-lifewood-white px-5 py-4 text-lifewood-dark placeholder:text-lifewood-dark/45 focus:outline-none focus:ring-2 focus:ring-lifewood-green dark:border-lifewood-paper/25 dark:bg-lifewood-dark/80 dark:text-lifewood-seaSalt dark:placeholder:text-lifewood-seaSalt/50"
            />
            <input
              type="email"
              name="email"
              required
              placeholder={t.email}
              className="w-full rounded-2xl border border-lifewood-paper bg-lifewood-white px-5 py-4 text-lifewood-dark placeholder:text-lifewood-dark/45 focus:outline-none focus:ring-2 focus:ring-lifewood-green dark:border-lifewood-paper/25 dark:bg-lifewood-dark/80 dark:text-lifewood-seaSalt dark:placeholder:text-lifewood-seaSalt/50"
            />
          </div>

          <select
            required
            defaultValue=""
            name="inquiryType"
            className="w-full rounded-2xl border border-lifewood-paper bg-lifewood-white px-5 py-4 text-lifewood-dark focus:outline-none focus:ring-2 focus:ring-lifewood-green dark:border-lifewood-paper/25 dark:bg-lifewood-dark/80 dark:text-lifewood-seaSalt"
          >
            <option value="" disabled>
              {t.inquiryType}
            </option>
            <option value="general">{t.inquiryGeneral}</option>
            <option value="services">{t.inquiryServices}</option>
            <option value="partnership">{t.inquiryPartnership}</option>
          </select>

          <textarea
            required
            rows={5}
            name="message"
            placeholder={t.message}
            className="w-full resize-none rounded-2xl border border-lifewood-paper bg-lifewood-white px-5 py-4 text-lifewood-dark placeholder:text-lifewood-dark/45 focus:outline-none focus:ring-2 focus:ring-lifewood-green dark:border-lifewood-paper/25 dark:bg-lifewood-dark/80 dark:text-lifewood-seaSalt dark:placeholder:text-lifewood-seaSalt/50"
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-lifewood-green py-4 text-2xl font-extrabold text-lifewood-white shadow-[0_18px_35px_rgba(4,98,65,0.25)] transition hover:brightness-110 active:scale-[0.99]"
          >
            {submitLabel}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactModal;
