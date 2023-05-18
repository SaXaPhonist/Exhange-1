import { forwardRef } from "react";
import { Group, Text } from "@mantine/core";
import Image from "next/image";
import defaultIcon from '../../public/vercel.svg'

interface ItemProps extends React.ComponentPropsWithoutRef<"div"> {
  image: string;
  label: string;
  description: string;
  id: string
}

const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ image, label, description, id, ...others }: ItemProps, ref) => {

    return (
        <div ref={ref} {...others} key={id} >
          <Group className="flex flex-row" noWrap>
            <Image src={image || defaultIcon} alt="currency" width={20} height={20}/>
            <Text size="sm">{label}</Text>
            <Text size="sm" opacity={0.65}>
              {description}
            </Text>
          </Group>
        </div>
      )
  }
);

SelectItem.displayName = "SelectItem";
export default SelectItem;
