
import React from 'react';
import type { TravelGuide, Phrase, GroundingChunk } from '../types';
import { GuideSection } from './GuideSection';
import { BudgetCalculator } from './BudgetCalculator';
import { useLanguage } from '../contexts/LanguageContext';

interface GuideDisplayProps {
  guide: TravelGuide;
  sources: GroundingChunk[];
}

const InfoCard: React.FC<{ title: string; value: string; icon: string }> = ({ title, value, icon }) => (
    <div className="bg-black/20 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-lg flex flex-col items-center text-center">
        <i className={`${icon} text-3xl text-[--accent-color] mb-3`} style={{ color: 'var(--accent-color)' }}></i>
        <h3 className="font-bold text-slate-400 text-sm uppercase tracking-wider">{title}</h3>
        <p className="text-lg text-white font-semibold mt-1">{value}</p>
    </div>
);

const InfoTextSection: React.FC<{ title: string; content: string; icon: string; color: string }> = ({ title, content, icon, color }) => {
    if (!content) return null;
    return (
        <section>
            <div className="flex items-center gap-3 mb-4">
                <i className={`${icon} ${color} text-2xl`}></i>
                <h3 className="text-2xl font-bold text-white">{title}</h3>
            </div>
            <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-xl shadow-lg p-6">
                <p className="text-slate-300 whitespace-pre-wrap">{content}</p>
            </div>
        </section>
    );
};

const PhrasesList: React.FC<{ phrases: Phrase[] }> = ({ phrases }) => {
  if (!phrases || phrases.length === 0) {
    return null;
  }

  return (
    <section>
      <div className="flex items-center gap-3 mb-6">
        <i className="fa-solid fa-comments text-cyan-400 text-2xl"></i>
        <h3 className="text-2xl font-bold text-white">Useful Phrases</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {phrases.map((p, index) => (
          <div key={index} className="bg-black/20 backdrop-blur-md border border-white/10 rounded-lg shadow-lg p-4 flex justify-between items-center">
            <span className="text-slate-300">{p.phrase}</span>
            <span className="font-semibold text-[--accent-color] text-right" style={{ color: 'var(--accent-color)' }}>{p.translation}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

const Sources: React.FC<{ sources: GroundingChunk[] }> = ({ sources }) => {
  const { t } = useLanguage();
  return (
    <section>
        <div className="flex items-center gap-3 mb-4">
            <i className="fa-solid fa-globe text-sky-400 text-2xl"></i>
            <h3 className="text-2xl font-bold text-white">{t('sourcesTitle')}</h3>
        </div>
        <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-xl shadow-lg p-6">
            <p className="text-slate-400 mb-4">{t('sourcesBody')}</p>
            <ul className="list-disc list-inside space-y-2">
                {sources.map((source, index) => (
                    source.web && (
                        <li key={index}>
                            <a 
                                href={source.web.uri} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-sky-400 hover:text-sky-300 underline transition-colors"
                            >
                                {source.web.title || source.web.uri}
                            </a>
                        </li>
                    )
                ))}
            </ul>
        </div>
    </section>
  );
};


export const GuideDisplay: React.FC<GuideDisplayProps> = ({ guide, sources }) => {
  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-white">Your Guide to <span className="text-[--accent-color]" style={{ color: 'var(--accent-color)' }}>{guide.destination}</span></h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <InfoCard title="Local Language" value={guide.culture?.localLanguage || 'N/A'} icon="fa-solid fa-language" />
            <InfoCard title="Est. Daily Stay Cost" value={guide.budget?.estimatedDailyCost || 'N/A'} icon="fa-solid fa-wallet" />
            <InfoCard title="Est. Round-trip Travel" value={guide.budget?.estimatedTravelCost || 'N/A'} icon="fa-solid fa-plane-circle-check" />
        </div>

        <div className="space-y-12">
            {guide.budget && <BudgetCalculator budget={guide.budget} />}

            <GuideSection 
                title="Popular Places to Visit" 
                items={guide.popularPlaces} 
                icon="fa-solid fa-landmark"
                color="text-amber-400"
            />
            <GuideSection 
                title="Top Restaurants" 
                items={guide.restaurants} 
                icon="fa-solid fa-utensils"
                color="text-rose-400"
            />
            <GuideSection 
                title="Cozy Cafes" 
                items={guide.cafes} 
                icon="fa-solid fa-mug-saucer"
                color="text-lime-400"
            />
             <GuideSection 
                title="Recommended Hotels" 
                items={guide.hotels} 
                icon="fa-solid fa-hotel"
                color="text-violet-400"
            />
            <InfoTextSection 
                title="Getting Around"
                content={guide.transport.gettingAround}
                icon="fa-solid fa-route"
                color="text-fuchsia-400"
            />
             <GuideSection 
                title="Major Airports" 
                items={guide.transport.airports} 
                icon="fa-solid fa-plane-departure"
                color="text-teal-400"
            />
             <GuideSection 
                title="Major Railway Stations" 
                items={guide.transport.railwayStations} 
                icon="fa-solid fa-train-subway"
                color="text-sky-400"
            />
            <PhrasesList phrases={guide.culture.usefulPhrases} />
             <GuideSection 
                title="Police Stations" 
                items={guide.safety.policeStations} 
                icon="fa-solid fa-shield-halved"
                color="text-indigo-400"
            />
            {sources && sources.length > 0 && <Sources sources={sources} />}
        </div>
    </div>
  );
};
