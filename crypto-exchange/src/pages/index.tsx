import { Inter } from "next/font/google";
import { Title, Text } from "@mantine/core";
import  CurrencyInput  from "@/components/ExchangeSection";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main
      className={`flex max-w-screen-2xl
                  lg:my-0 lg:mx-auto md:min-h-screen
                  flex-col p-0 mt-16 mx-0 px-4 mb-0
                  md:mt-0 md:p-56 md:pb-40 ${inter.className}`}
    >
          <Title className="mb-4" order={2} weight={300} size={'2.5rem'}>Crypto Exchange</Title>
          <Text fz={'lg'} fw={400} className="mb-16">Exchange fast and easy</Text>
        <div>
          <CurrencyInput />
        </div>
    </main>
  );
}
