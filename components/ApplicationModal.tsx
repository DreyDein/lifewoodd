
import React from 'react';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: any;
}

const ApplicationModal: React.FC<ApplicationModalProps> = ({ isOpen, onClose, t }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-start sm:items-center justify-center p-3 overflow-y-hidden bg-lifewood-dark/40 backdrop-blur-sm">
      <div className="relative w-full max-w-xl bg-lifewood-seaSalt rounded-[1.5rem] shadow-2xl overflow-auto animate-in fade-in zoom-in duration-300 dark:bg-lifewood-dark/90 dark:border dark:border-lifewood-green/20 max-h-[90vh] sm:my-6">
        
        {/* Top-right close 'X' button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-lifewood-dark hover:opacity-70 transition-opacity z-10 dark:text-lifewood-paper"
          aria-label={t.closeButton}
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-3 md:p-4">
          {/* Header Section */}
          <div className="text-center mb-3">
            <h2 className="text-3xl md:text-4xl font-extrabold text-lifewood-green mb-3 font-sans dark:text-lifewood-saffron">
              {t.joinTitle}
            </h2>
            <p className="text-lifewood-dark/70 text-base leading-relaxed max-w-md mx-auto dark:text-lifewood-seaSalt/70">
              {t.joinDescription}
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-lifewood-paper/95 rounded-2xl p-4 shadow-md border border-lifewood-paper/20 dark:bg-lifewood-dark dark:border-lifewood-paper/12 dark:shadow-lg">
            <h3 className="text-xl md:text-2xl font-bold text-lifewood-green mb-2 dark:text-lifewood-earth">{t.formTitle}</h3>
            <p className="text-lifewood-dark/60 text-sm mb-4 dark:text-lifewood-seaSalt/70">{t.formDesc}</p>

            <form className="space-y-2.5" onSubmit={(e) => { e.preventDefault(); alert(t.successMessage); onClose(); }}>
              <div className="pr-4 pb-6 space-y-2.5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-lifewood-dark dark:text-lifewood-seaSalt">{t.firstName}</label>
                    <input 
                      type="text" 
                      required
                      className="w-full px-3 py-2 bg-lifewood-seaSalt border border-lifewood-paper rounded-lg focus:ring-2 focus:ring-lifewood-green outline-none dark:bg-lifewood-dark/76 dark:border-lifewood-paper/12 dark:text-lifewood-paper"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-lifewood-dark dark:text-lifewood-seaSalt">{t.lastName}</label>
                    <input 
                      type="text" 
                      required
                      className="w-full px-3 py-2 bg-lifewood-seaSalt border border-lifewood-paper rounded-lg focus:ring-2 focus:ring-lifewood-green outline-none dark:bg-lifewood-dark/76 dark:border-lifewood-paper/12 dark:text-lifewood-paper"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-lifewood-dark dark:text-lifewood-seaSalt">{t.age}</label>
                    <input 
                      type="number" 
                      className="w-full px-3 py-2 bg-lifewood-seaSalt border border-lifewood-paper rounded-lg focus:ring-2 focus:ring-lifewood-green outline-none dark:bg-lifewood-dark/76 dark:border-lifewood-paper/12 dark:text-lifewood-paper"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-lifewood-dark dark:text-lifewood-seaSalt">{t.email}</label>
                    <input 
                      type="email" 
                      required
                      className="w-full px-3 py-2 bg-lifewood-seaSalt border border-lifewood-paper rounded-lg focus:ring-2 focus:ring-lifewood-green outline-none dark:bg-lifewood-dark/76 dark:border-lifewood-paper/12 dark:text-lifewood-paper"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-lifewood-dark dark:text-lifewood-seaSalt">{t.degree}</label>
                  <input 
                    type="text" 
                    placeholder={t.degreePlaceholder}
                    className="w-full px-3 py-2 bg-lifewood-seaSalt border border-lifewood-paper rounded-lg focus:ring-2 focus:ring-lifewood-green outline-none dark:bg-lifewood-dark/76 dark:border-lifewood-paper/12 dark:text-lifewood-paper"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-lifewood-dark dark:text-lifewood-seaSalt">{t.project}</label>
                  <select 
                    required
                      className="w-full px-3 py-2 bg-lifewood-seaSalt text-lifewood-dark border border-lifewood-paper rounded-lg focus:ring-2 focus:ring-lifewood-green outline-none appearance-none dark:bg-lifewood-dark dark:border-lifewood-paper/12 dark:text-lifewood-seaSalt"
                  >
                      <option value="" className="text-lifewood-dark dark:text-lifewood-seaSalt dark:bg-lifewood-dark">{t.selectProject}</option>
                    {t.projectOptions.map((option: any) => (
                      <option key={option.value} value={option.value} className="text-lifewood-dark dark:text-lifewood-seaSalt dark:bg-lifewood-dark">
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-lifewood-dark dark:text-lifewood-seaSalt">{t.experience}</label>
                  <textarea 
                    rows={3}
                      placeholder={t.experiencePlaceholder}
                    className="w-full px-3 py-2 bg-lifewood-seaSalt border border-lifewood-paper rounded-lg focus:ring-2 focus:ring-lifewood-green outline-none resize-none dark:bg-lifewood-dark/76 dark:border-lifewood-paper/12 dark:text-lifewood-paper"
                  ></textarea>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <button 
                    type="submit"
                    className="flex-1 py-2 bg-lifewood-green text-lifewood-white font-bold rounded-lg transform transition duration-150 ease-in-out hover:-translate-y-0.5 active:scale-95 shadow-lg"
                  >
                    {t.submitButton}
                  </button>
                  <button 
                    type="button"
                    onClick={onClose}
                    style={{ backgroundColor: '#046241' }}
                    className="flex-1 py-2 text-white font-bold rounded-lg transform transition duration-200 ease-in-out hover:opacity-90 hover:shadow-md active:scale-95 focus:outline-none"
                  >
                    {t.closeButton}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationModal;
