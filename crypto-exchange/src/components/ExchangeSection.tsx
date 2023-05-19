import { TextInput, Button, Text } from "@mantine/core";
import Image from "next/image";
import SwapIcon from "../../public/swap.svg";
import { useEffect, useState } from "react";
import { apiClient } from "../../lib/api";
import { apiRoutes } from "../../lib/const";
import CustomSelect from "./Select";
import { ICryptoCurrency, ISelectedCryptoCoin } from "@/types";
import { useDebouncedValue } from "@mantine/hooks";

type GetCryptoCurrency = ICryptoCurrency[];

export default function CurrencyInput() {
  const [cryptoData, setCryptoData] = useState<ICryptoCurrency[] | null>(null);
  const [isSearchOpen, setSearchOpen] = useState({
    first: false,
    second: false,
  });

  const [selectedCoinFrom, setSelectedCoinFrom] =
    useState<ISelectedCryptoCoin | null>({
      currency: "btc",
      fullName: 'Bitcoin',
      network: "btc",
      icon: "https://content-api.changenow.io/uploads/btc_d8db07f87d.svg",
    });
  const [selectedCoinTo, setSelectedCoinTo] =
    useState<ISelectedCryptoCoin | null>({
      currency: "eth",
      fullName: 'Etherium',
      network: "eth",
      icon: "https://content-api.changenow.io/uploads/eth_f4ebb54ec0.svg",
    });

  const [fromAmountValue, setFromAmountValue] = useState<string | null>(null);
  const [toAmountValue, setToAmountValue] = useState<string | null>(null);
  const [debouncedFromValue] = useDebouncedValue(fromAmountValue, 300);
  const [debouncedToValue] = useDebouncedValue(toAmountValue, 300);
  const [amountError, setAmountError] = useState(false);
  const [disablePairError, setDisableError] = useState(false);

 const swapCurrencies = () => {
    if(selectedCoinFrom && selectedCoinTo){
      setSelectedCoinFrom(selectedCoinTo)
      setSelectedCoinTo(selectedCoinFrom)
    }
 }

  const estimatedDirect = async () => {
    try {
      const res = await apiClient.get(apiRoutes.estimatedAmount, {
        params: {
          fromCurrency: selectedCoinFrom?.currency,
          toCurrency: selectedCoinTo?.currency,
          fromAmount: debouncedFromValue,
          flow: "standard",
          ...(selectedCoinFrom?.network && {
            fromNetwork: selectedCoinFrom.network,
          }),
          ...(selectedCoinTo?.network && {
            toNetwork: selectedCoinTo.network,
          }),
        },
      });
      if (res.data.toAmount === null) {
        setDisableError(true);
        return;
      }
      setToAmountValue(res.data.toAmount);
      setAmountError(false);
      setDisableError(false);
    } catch (error) {
      setAmountError(true);
    }
  };

  const estimatedReverse = () => {
    // for right input
  };

  const getMinAmountFrom = () =>
    apiClient
      .get(apiRoutes.minAmount, {
        params: {
          fromCurrency: selectedCoinFrom?.currency,
          toCurrency: selectedCoinTo?.currency,
          ...(selectedCoinFrom?.network && {
            fromNetwork: selectedCoinFrom.network,
          }),
          ...(selectedCoinTo?.network && {
            toNetwork: selectedCoinTo.network,
          }),
        },
      })
      .then((res) => {
        if (res.data.minAmount === null) {
          setDisableError(true);
          return;
        }
        setFromAmountValue(res.data.minAmount);
        setDisableError(false)
      })
      .catch((err) => console.log(err));

  useEffect(() => {
    if (debouncedFromValue) {
      estimatedDirect();
    }
  }, [selectedCoinTo, debouncedFromValue]);

  useEffect(() => {
    if (selectedCoinFrom) {
      getMinAmountFrom();
    }
  }, []);

  useEffect(() => {
    if (debouncedFromValue === null) {
      getMinAmountFrom();
    }
  }, [debouncedFromValue]);

  useEffect(() => {
    if (amountError) {
      setToAmountValue("-");
    }
  }, [amountError]);

  useEffect(() => {
    apiClient
      .get<GetCryptoCurrency>(apiRoutes.allCurrencies, {
        params: {
          flow: "standard",
          active: true,
        },
      })
      .then((res) => setCryptoData(res.data))
      .catch(() => console.log("Cannot get all currencies"));
  }, []);

  return (
    <>
      <div
        className="flex flex-col xl:flex-row
                      items-end xl:items-baseline mb-6 
                      [&>*]:mb-4 [&>*:last-child]:mb-0 xl:[&>*]:mb-0
                      xl:[&>*]:mr-7 xl:[&>*:last-child]:mr-0"
      >
        <TextInput
          radius="sm"
          size="lg"
          type="number"
          className="w-full"
          classNames={{
            wrapper: isSearchOpen.first
              ? "border border-[#C1D9E6]"
              : "border border-[#E3EBEF]",
            input: "border-0 bg-[#F6F7F8]",
            rightSection: isSearchOpen.first ? "w-full" : "",
          }}
          placeholder="amount"
          onChange={(e) => setFromAmountValue(e.target.value)}
          value={fromAmountValue || ""}
          rightSection={
            <CustomSelect
              setSearchOpen={setSearchOpen}
              setSelectedCoin={setSelectedCoinFrom}
              coinIcon={selectedCoinFrom?.icon}
              setMinAmountFrom={setFromAmountValue}
              cryptoData={cryptoData}
              selectTag="first"
              currencyName={selectedCoinFrom?.currency}
            />
          }
          rightSectionWidth={"35%"}
        />
        <Image src={SwapIcon} alt="swap currency" className="xl:rotate-90 cursor-pointer"  onClick={swapCurrencies}/>
        <TextInput
          radius="sm"
          size="lg"
          classNames={{
            wrapper: isSearchOpen.second
              ? "border border-[#C1D9E6]"
              : "border border-[#E3EBEF]",
            input: "border-0 bg-[#F6F7F8]",
            rightSection: isSearchOpen.second ? "w-full" : "",
          }}
          onChange={(e) => {
            setToAmountValue(e.target.value);
          }}
          className="w-full"
          type="number"
          error={amountError ? "Exchange amount too small" : false}
          value={toAmountValue || ""}
          placeholder={amountError ? "-" : "amount"}
          rightSection={
            <CustomSelect
              setSearchOpen={setSearchOpen}
              setSelectedCoin={setSelectedCoinTo}
              cryptoData={cryptoData}
              currencyName={selectedCoinTo?.currency}
              coinIcon={selectedCoinTo?.icon}
              selectTag="second"
            />
          }
          rightSectionWidth={"35%"}
        />
      </div>
      {!amountError && <div className="w-full h-6"></div>}
      <div className="mb-2 flex flex-col lg:flex-row lg:items-end ">
        <TextInput
          size="lg"
          radius="sm"
          label={`Your ${selectedCoinTo?.fullName} address`}
          className="mb-4 md:mb-0 md:mr-8 md:max-w-[723px] md:w-full"
          classNames={{
            wrapper: " border border-[#E3EBEF]",
            input: "bg-[#F6F7F8] border-0",
            label: "mb-2",
          }}
        />
        <Button
          className="w-full grow bg-[#11B3FE] [&:hover]:bg-[#0095E0] [&:hover]:pointer md:w-auto md:h-[51px]"
          size="lg"
        >
          Exchange
        </Button>
      </div>
      <div className="flex flex-col lg:flex-row lg:items-end">
        <p className="mb-4 md:mb-0 md:mr-8 md:max-w-[723px] md:w-full"></p>
        <Text
          fz={"sm"}
          className="w-full text-center text-red-500 grow md:w-auto md:h-[24px]"
        >
          {disablePairError && "This pair is disabled now"}
        </Text>
      </div>
    </>
  );
}
