import React, { useState } from 'react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: any;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, t }) => {
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    setSubmitted(false);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
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

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              type="text"
              required
              placeholder={t.fullName}
              className="w-full rounded-2xl border border-lifewood-paper bg-lifewood-white px-5 py-4 text-lifewood-dark placeholder:text-lifewood-dark/45 focus:outline-none focus:ring-2 focus:ring-lifewood-green dark:border-lifewood-paper/25 dark:bg-lifewood-dark/80 dark:text-lifewood-seaSalt dark:placeholder:text-lifewood-seaSalt/50"
            />
            <input
              type="email"
              required
              placeholder={t.email}
              className="w-full rounded-2xl border border-lifewood-paper bg-lifewood-white px-5 py-4 text-lifewood-dark placeholder:text-lifewood-dark/45 focus:outline-none focus:ring-2 focus:ring-lifewood-green dark:border-lifewood-paper/25 dark:bg-lifewood-dark/80 dark:text-lifewood-seaSalt dark:placeholder:text-lifewood-seaSalt/50"
            />
          </div>

          <select
            required
            defaultValue=""
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
            placeholder={t.message}
            className="w-full resize-none rounded-2xl border border-lifewood-paper bg-lifewood-white px-5 py-4 text-lifewood-dark placeholder:text-lifewood-dark/45 focus:outline-none focus:ring-2 focus:ring-lifewood-green dark:border-lifewood-paper/25 dark:bg-lifewood-dark/80 dark:text-lifewood-seaSalt dark:placeholder:text-lifewood-seaSalt/50"
          />

          <button
            type="submit"
            className="w-full rounded-2xl bg-lifewood-green py-4 text-2xl font-extrabold text-lifewood-white shadow-[0_18px_35px_rgba(4,98,65,0.25)] transition hover:brightness-110 active:scale-[0.99]"
          >
            {t.send}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactModal;
