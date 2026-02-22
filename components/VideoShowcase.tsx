import React from 'react';

interface VideoShowcaseProps {
  t: any;
}

const VideoShowcase: React.FC<VideoShowcaseProps> = ({ t }) => {
  return (
    <section id="video-showcase" className="py-24 px-6 md:px-12 bg-lifewood-dark text-lifewood-white transition-colors overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 order-2 lg:order-1">
            <div className="uppercase tracking-[0.3em] text-lifewood-saffron font-bold text-sm opacity-80">{t.label}</div>
            <h2 className="text-4xl md:text-5xl font-black leading-tight tracking-tight">{t.title}</h2>
            <p className="text-lg text-lifewood-seaSalt/70 leading-relaxed font-medium">{t.description}</p>
            <div className="pt-4 flex flex-wrap gap-4">
              <div className="flex items-center gap-3 bg-lifewood-white/5 p-4 rounded-xl border border-white/10">
                <div className="text-2xl">🌍</div>
                <div className="text-sm font-bold">{t.featureInfrastructure}</div>
              </div>
              <div className="flex items-center gap-3 bg-lifewood-white/5 p-4 rounded-xl border border-white/10">
                <div className="text-2xl">⚡</div>
                <div className="text-sm font-bold">{t.featureSpeed}</div>
              </div>
            </div>
          </div>

          <div className="relative order-1 lg:order-2 group">
            <div className="absolute -inset-4 bg-lifewood-green/20 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-black">
              <video controls className="w-full h-full object-cover" poster="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80">
                <source src="/Lifewood_Services.mp4" type="video/mp4" />
                {t.videoFallback}
              </video>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoShowcase;
