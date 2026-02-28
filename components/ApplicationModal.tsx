import React, { useState } from 'react';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: any;
}

const ApplicationModal: React.FC<ApplicationModalProps> = ({ isOpen, onClose, t }) => {
  const [submitted, setSubmitted] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    setSubmitted(false);
    setCvFile(null);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setCvFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) setCvFile(file);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-start sm:items-center justify-center p-3 overflow-y-hidden bg-lifewood-dark/40 backdrop-blur-sm">
      <div className="relative w-full max-w-xl bg-lifewood-seaSalt rounded-[1.5rem] shadow-2xl overflow-auto animate-in fade-in zoom-in duration-300 dark:bg-lifewood-dark/90 dark:border dark:border-lifewood-green/20 max-h-[90vh] sm:my-6">

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 text-lifewood-dark hover:opacity-70 transition-opacity z-10 dark:text-lifewood-paper"
          aria-label={t.closeButton}
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-3 md:p-4">
          {/* Header */}
          <div className="text-center mb-3">
            <h2 className="text-3xl md:text-4xl font-extrabold text-lifewood-green mb-3 font-sans dark:text-lifewood-saffron">
              {t.joinTitle}
            </h2>
            <p className="text-lifewood-dark/70 text-base leading-relaxed max-w-md mx-auto dark:text-lifewood-seaSalt/90">
              {t.joinDescription}
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-lifewood-paper/95 rounded-2xl p-4 shadow-md border border-lifewood-paper/20 dark:bg-lifewood-dark/95 dark:border-lifewood-paper/20 dark:shadow-lg">
            <h3 className="text-xl md:text-2xl font-bold text-lifewood-green mb-2 dark:text-lifewood-earth">{t.formTitle}</h3>
            <p className="text-lifewood-dark/60 text-sm mb-4 dark:text-lifewood-seaSalt/85">{t.formDesc}</p>

            {submitted && (
              <div className="mb-4 rounded-lg border border-lifewood-green/35 bg-lifewood-green/10 px-4 py-3 text-sm font-semibold text-lifewood-green dark:border-lifewood-saffron/60 dark:bg-lifewood-saffron/10 dark:text-lifewood-saffron">
                {t.successMessage}
              </div>
            )}

            <form className="space-y-2.5" onSubmit={handleSubmit}>
              <div className="pr-4 pb-6 space-y-2.5">

                {/* First + Last Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-lifewood-dark dark:text-lifewood-seaSalt">{t.firstName}</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 bg-lifewood-seaSalt border border-lifewood-paper rounded-lg focus:ring-2 focus:ring-lifewood-green outline-none dark:bg-lifewood-dark/80 dark:border-lifewood-paper/25 dark:text-lifewood-seaSalt placeholder:text-lifewood-dark/40 dark:placeholder:text-lifewood-seaSalt/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-lifewood-dark dark:text-lifewood-seaSalt">{t.lastName}</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 bg-lifewood-seaSalt border border-lifewood-paper rounded-lg focus:ring-2 focus:ring-lifewood-green outline-none dark:bg-lifewood-dark/80 dark:border-lifewood-paper/25 dark:text-lifewood-seaSalt placeholder:text-lifewood-dark/40 dark:placeholder:text-lifewood-seaSalt/50"
                    />
                  </div>
                </div>

                {/* Age + Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-lifewood-dark dark:text-lifewood-seaSalt">{t.age}</label>
                    <input
                      type="number"
                      inputMode="numeric"
                      min={0}
                      max={99}
                      onInput={(e) => {
                        const target = e.currentTarget;
                        const digits = target.value.replace(/\D/g, '').slice(0, 2);
                        target.value = digits;
                      }}
                      className="w-full px-3 py-2 bg-lifewood-seaSalt border border-lifewood-paper rounded-lg focus:ring-2 focus:ring-lifewood-green outline-none dark:bg-lifewood-dark/80 dark:border-lifewood-paper/25 dark:text-lifewood-seaSalt placeholder:text-lifewood-dark/40 dark:placeholder:text-lifewood-seaSalt/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-lifewood-dark dark:text-lifewood-seaSalt">{t.email}</label>
                    <input
                      type="email"
                      required
                      className="w-full px-3 py-2 bg-lifewood-seaSalt border border-lifewood-paper rounded-lg focus:ring-2 focus:ring-lifewood-green outline-none dark:bg-lifewood-dark/80 dark:border-lifewood-paper/25 dark:text-lifewood-seaSalt placeholder:text-lifewood-dark/40 dark:placeholder:text-lifewood-seaSalt/50"
                    />
                  </div>
                </div>

                {/* Degree */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-lifewood-dark dark:text-lifewood-seaSalt">{t.degree}</label>
                  <input
                    type="text"
                    placeholder={t.degreePlaceholder}
                    className="w-full px-3 py-2 bg-lifewood-seaSalt border border-lifewood-paper rounded-lg focus:ring-2 focus:ring-lifewood-green outline-none dark:bg-lifewood-dark/80 dark:border-lifewood-paper/25 dark:text-lifewood-seaSalt placeholder:text-lifewood-dark/40 dark:placeholder:text-lifewood-seaSalt/50"
                  />
                </div>

                {/* Position Applied For */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-lifewood-dark dark:text-lifewood-seaSalt">{t.project}</label>
                  <select
                    required
                    className="w-full px-3 py-2 bg-lifewood-seaSalt text-lifewood-dark border border-lifewood-paper rounded-lg focus:ring-2 focus:ring-lifewood-green outline-none appearance-none dark:bg-lifewood-dark/80 dark:border-lifewood-paper/25 dark:text-lifewood-seaSalt"
                  >
                    <option value="">{t.selectProject}</option>
                    {t.projectOptions?.map((option: any) => (
                      <option key={option.value} value={option.value} className="text-lifewood-dark dark:text-lifewood-seaSalt dark:bg-lifewood-dark">
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Relevant Experience */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-lifewood-dark dark:text-lifewood-seaSalt">{t.experience}</label>
                  <textarea
                    rows={3}
                    placeholder={t.experiencePlaceholder}
                    className="w-full px-3 py-2 bg-lifewood-seaSalt border border-lifewood-paper rounded-lg focus:ring-2 focus:ring-lifewood-green outline-none resize-none dark:bg-lifewood-dark/80 dark:border-lifewood-paper/25 dark:text-lifewood-seaSalt placeholder:text-lifewood-dark/40 dark:placeholder:text-lifewood-seaSalt/50"
                  />
                </div>

                {/* ✅ CV / Resume Upload */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-lifewood-dark dark:text-lifewood-seaSalt">
                    CV / Resume
                    <span className="ml-1 text-xs font-normal text-lifewood-dark/40 dark:text-lifewood-seaSalt/40">(PDF, DOC, DOCX — Max 5MB)</span>
                  </label>

                  <div
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('cv-upload')?.click()}
                    className="cursor-pointer rounded-xl border-2 border-dashed p-5 flex flex-col items-center justify-center text-center transition-all duration-200"
                    style={{
                      borderColor: dragOver ? '#2D6A4F' : cvFile ? '#2D6A4F' : '#c8c4b8',
                      backgroundColor: dragOver
                        ? 'rgba(45,106,79,0.06)'
                        : cvFile
                        ? 'rgba(45,106,79,0.04)'
                        : 'transparent',
                    }}
                  >
                    {/* Icon */}
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-2 transition-all duration-200"
                      style={{ background: cvFile ? 'rgba(45,106,79,0.12)' : 'rgba(0,0,0,0.05)' }}
                    >
                      {cvFile ? (
                        <svg className="w-5 h-5 text-lifewood-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-lifewood-dark/40 dark:text-lifewood-seaSalt/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      )}
                    </div>

                    {cvFile ? (
                      <>
                        <p className="text-sm font-bold text-lifewood-green truncate max-w-[220px]">{cvFile.name}</p>
                        <p className="text-xs text-lifewood-dark/40 dark:text-lifewood-seaSalt/40 mt-0.5">
                          {(cvFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setCvFile(null); }}
                          className="mt-1.5 text-xs text-red-400 hover:text-red-600 font-semibold transition-colors"
                        >
                          Remove file
                        </button>
                      </>
                    ) : (
                      <>
                        <p className="text-sm font-semibold text-lifewood-dark/60 dark:text-lifewood-seaSalt/60">
                          Drag & drop your CV here
                        </p>
                        <p className="text-xs text-lifewood-dark/40 dark:text-lifewood-seaSalt/40 mt-0.5">
                          or <span className="text-lifewood-green font-bold">click to browse</span>
                        </p>
                      </>
                    )}
                  </div>

                  {/* Hidden file input */}
                  <input
                    id="cv-upload"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-lifewood-green text-lifewood-white font-bold rounded-lg transform transition duration-150 ease-in-out hover:-translate-y-0.5 active:scale-95 shadow-lg"
                  >
                    {t.submitButton}
                  </button>
                  <button
                    type="button"
                    onClick={handleClose}
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