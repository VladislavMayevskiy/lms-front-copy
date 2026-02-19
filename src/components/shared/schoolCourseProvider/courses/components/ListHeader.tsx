import { useState, useCallback } from "react";
import {
  HStack,
  Text,
  // Button,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import Search from "assets/imgs/admin/search.svg?react";
// import Sort from "assets/imgs/filter/sort.svg?react";
import { useDebounce } from "hooks/useDebounce";

type Props = {
  title: string;
  seach?: string;
  handleSearchChange: (search: string) => void;
};

export const ListHeader = ({ title, seach, handleSearchChange }: Props) => {
  const [query, setQuery] = useState<string>(seach || '');
  const debounce = useDebounce(() => handleSearchChange(query), 500);

  const handleChange = useCallback((newQuery: string) => {
    setQuery(newQuery);
    debounce();
  }, [debounce, seach]);

  return (
    <div className="flex items-center justify-between">
      <Text fontFamily="Lato" textColor="#434645" fontWeight="medium" fontSize="20px">
        {title}
      </Text>

      <HStack>
        <InputGroup w="320px">
          <InputLeftElement>
            <Search />
          </InputLeftElement>
          <Input
            placeholder="Search"
            fontFamily="Lato"
            value={query}
            onChange={(e) => handleChange(e.target.value)}
          />
        </InputGroup>

        {/* <Button
          bg="#F5F7F9"
          border="1px solid #B4D6DF"
          borderRadius="6px"
          h="40px"
          w="101px"
          leftIcon={<Sort />}
          textColor="#0070C1"
        >
          Filter
        </Button> */}
      </HStack>
    </div>
  );
};