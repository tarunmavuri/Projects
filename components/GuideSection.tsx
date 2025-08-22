import React from 'react';
import type { GuideItem } from '../types';

interface GuideSectionProps {
  title: string;
  items: GuideItem[];
  icon: string;
  color: string;
}

const RatingStars: React.FC<{ rating: number }> = ({ rating }) => {
    // Clamp rating between 0 and 5 to be defensive against unexpected API values.
    const clampedRating = Math.max(0, Math.min(5, rating));

    const fullStars = Math.floor(clampedRating);
    const halfStar = clampedRating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
        <div className="flex items-center text-amber-400" aria-label={`Rating: ${clampedRating.toFixed(1)} out of 5 stars`}>
            {[...Array(fullStars)].map((_, i) => <i key={`full-${i}`} className="fa-solid fa-star"></i>)}
            {halfStar && <i className="fa-solid fa-star-half-stroke"></i>}
            {[...Array(emptyStars)].map((_, i) => <i key={`empty-${i}`} className="fa-regular fa-star"></i>)}
            <span className="ml-2 text-sm font-semibold text-slate-400">{clampedRating.toFixed(1)}</span>
        </div>
    );
};

const GuideItemCard: React.FC<{ item: GuideItem }> = ({ item }) => {
    const CardBody = (
        <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-xl shadow-lg overflow-hidden transition-all duration-300 group-hover:border-[--accent-color]/50 group-hover:shadow-2xl h-full flex flex-col p-6">
            <div className="flex justify-between items-start gap-2">
                <h4 className="text-lg font-bold text-white flex-1">{item.name}</h4>
                {item.websiteUrl && <i className="fa-solid fa-arrow-up-right-from-square text-slate-500 group-hover:text-[--accent-color] transition-colors duration-300"></i>}
            </div>

            {item.location && <p className="text-sm text-slate-400 mt-1 flex items-center gap-2"><i className="fa-solid fa-location-dot"></i>{item.location}</p>}
            
            <div className="flex justify-between items-center mt-3 gap-2">
                 {item.rating ? <RatingStars rating={item.rating} /> : <div className="flex-1"></div>}
                 {item.priceRange && (
                    <span className="bg-slate-700 text-slate-300 text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap">{item.priceRange}</span>
                )}
            </div>
            
            <p className="mt-4 text-slate-300 flex-grow">{item.description}</p>
        </div>
    );

    if (item.websiteUrl) {
        return (
            <a href={item.websiteUrl} target="_blank" rel="noopener noreferrer" className="block group transition-transform duration-300 hover:scale-105 h-full">
                {CardBody}
            </a>
        );
    }
    
    return (
        <div className="group transition-transform duration-300 hover:scale-105 h-full">
            {CardBody}
        </div>
    );
};


export const GuideSection: React.FC<GuideSectionProps> = ({ title, items, icon, color }) => {
  if (!items || items.length === 0) {
    return null;
  }
  
  return (
    <section>
      <div className="flex items-center gap-3 mb-6">
        <i className={`${icon} ${color} text-2xl`}></i>
        <h3 className="text-2xl font-bold text-white">{title}</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, index) => (
          <GuideItemCard key={index} item={item} />
        ))}
      </div>
    </section>
  );
};