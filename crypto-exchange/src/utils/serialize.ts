import { ICryptoCurrency, ISerializedData } from "@/types";

export const serializeData = (data: ICryptoCurrency[], selectTag: string): ISerializedData[] => {
  return data.map((crypto) => ({
    value: `${crypto.ticker}"${crypto.name}"${crypto.image}"${selectTag}"${crypto.network}"${crypto.tokenContract}`,
    image: crypto.image,
    label: crypto.ticker.toLocaleUpperCase(),
    description: crypto.name,
    id: crypto.ticker+crypto.name+selectTag
  }));
};
