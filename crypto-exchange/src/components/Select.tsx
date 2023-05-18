import { Select } from "@mantine/core";
import SelectItem from "./SelectItem";
import { serializeData } from "@/utils/serialize";
import { ICryptoCurrency, ISelectTags, ISelectedCryptoCoin, ISerializedData } from "@/types";
import { Dispatch, SetStateAction, useState, useEffect } from "react";
import Image from "next/image";
import ArrowIcon from '../../public/Arrow-down.svg'

interface IProps {
  setSearchOpen: Dispatch<SetStateAction<ISelectTags>>;
  setSelectedCoin: Dispatch<
    SetStateAction< ISelectedCryptoCoin | null>
  >;
  coinIcon?: string | null;
  cryptoData: ICryptoCurrency[] | null;
  selectTag: keyof ISelectTags;
  currencyName?: string | null;
}

const CustomSelect = ({
  setSearchOpen,
  setSelectedCoin,
  coinIcon,
  currencyName,
  cryptoData,
  selectTag,
}: IProps) => {
    
    const [searchValue, setSearchValue] = useState('')

    useEffect(() => {
        if(!searchValue && currencyName){
            setSearchValue(currencyName?.toLocaleUpperCase())
        }
    }, [])


  return (
    <Select
      radius="sm"
      size="lg"
      limit={75}
      defaultValue={currencyName?.toLocaleUpperCase()}
      searchValue={searchValue}
      onSearchChange={setSearchValue}
      placeholder="Coin"
      icon={
        coinIcon ? (
          <Image src={coinIcon} width={24} height={24} alt="current coin" />
        ) : null
      }
      itemComponent={SelectItem}
      onChange={(valueKey) => {
        if (valueKey) {
          const values = valueKey?.split('"');
          setSelectedCoin({
            currency: values[0].toLocaleLowerCase(),
            network: values[4],
            icon: values[2],
            fullName: values[1]
          });
        }
      }}
      onDropdownClose={() => {
          setSearchOpen((prev) => ({ ...prev, [selectTag]: false }))
      }
      }
      onDropdownOpen={() => {
          setSearchOpen((prev) => ({ ...prev, [selectTag]: true }))

      }
      }
      data={cryptoData ? serializeData(cryptoData, selectTag) : [""]}
      searchable
      className="w-full cursor-pointer
                 relative before:content-['']
                 before:w-[1px] before:h-[30px]
                 before:border-l-[2px] before:border-[#E3EBEF]
                 before:absolute before:my-auto
                 before:z-[100] before:top-[50%] before:-translate-y-2/4"
      classNames={{ input: "border-0 bg-[#F6F7F8]", item: '[&:hover]:bg-[#EAF1F7]' }}
      styles={{
        dropdown: { top: "50px !important", backgroundColor: "#F6F7F8" },
        rightSection: { pointerEvents: 'none' } 
      }}
      maxDropdownHeight={400}
      rightSection={<Image src={ArrowIcon} alt='select' />}
      rightSectionWidth={30}
      nothingFound="Nobody here"
      filter={(value, item) =>
        item?.label?.toLowerCase().includes(value.toLowerCase().trim()) ||
        item?.description?.toLowerCase().includes(value.toLowerCase().trim())
      }
    />
  );
};

export default CustomSelect;
