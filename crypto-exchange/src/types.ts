export interface ISerializedData {
  value: string;
  image: string;
  label: string;
  description: string;
  id: string;
}

export interface ICryptoCurrency {
  ticker: string;
  name: string;
  image: string;
  hasExternalId: boolean;
  isFiat: boolean;
  featured: boolean;
  isStable: boolean;
  supportsFixedRate: boolean;
  network: string;
  tokenContract: string | null;
  buy: boolean;
  sell: true;
}

export interface ISelectTags {
  first: boolean;
  second: boolean;
}

export interface ISelectedCryptoCoin {
  currency: string | null;
  network: string | null;
  icon: string | null;
  fullName?: string;
}
