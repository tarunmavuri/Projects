
export type HotelPreference = 'premium' | 'average' | 'low';
export type TravelMode = 'flight' | 'train';

export interface GuideItem {
  name: string;
  description: string;
  location?: string;
  priceRange?: string;
  rating?: number;
  websiteUrl?: string;
}

export interface Phrase {
  phrase: string;
  translation: string;
}

export interface Budget {
  estimatedDailyCost: string;
  costPerPersonLocal: number;
  localCurrencyCode: string;
  costPerPersonOrigin: number;
  originCurrencyCode: string;
  estimatedTravelCost: string;
  travelCostPerPersonLocal: number;
  travelCostPerPersonOrigin: number;
}

export interface TravelGuide {
  destination: string;
  themeColorHex: string;
  popularPlaces: GuideItem[];
  restaurants: GuideItem[];
  cafes: GuideItem[];
  hotels: GuideItem[];
  transport: {
    railwayStations: GuideItem[];
    airports: GuideItem[];
    gettingAround: string;
  };
  safety: {
    policeStations: GuideItem[];
  };
  culture: {
    localLanguage: string;
    usefulPhrases: Phrase[];
  };
  budget: Budget;
}

export interface TripHistoryItem {
  destination: string;
  origin: string;
  timestamp: number;
  hotelPreference: HotelPreference;
  travelMode: TravelMode;
}

export interface WebSource {
  uri: string;
  title: string;
}

export interface GroundingChunk {
  web: WebSource;
}