import { useState, useMemo } from "react";
import {
  Box,
  Text,
  HStack,
  VStack,
  Input,
  InputGroup,
  InputLeftElement,
  Avatar,
  Skeleton,
  Button,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useTeacherStudents } from "api/user/hooks";
import { UserRoutes } from "constants/routes";
import Search from "assets/imgs/admin/search.svg?react";

function fullName(s: { first_name: string; last_name: string }): string {
  return `${s.first_name} ${s.last_name}`.trim();
}

export default function CourseStudentsList() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const { data, isLoading, isError } = useTeacherStudents();

  const students = useMemo(() => {
    const raw = data?.data ?? [];
    const q = search.trim().toLowerCase();
    if (!q) return raw;
    return raw.filter(
      (s) =>
        fullName(s).toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q),
    );
  }, [data, search]);

  return (
    <Box>
      <HStack justify="space-between" mb={4} flexWrap="wrap" rowGap={2}>
        <Text fontFamily="Lato" fontWeight="medium" fontSize="20px">
          {isLoading
            ? "Students"
            : `${students.length} Student${students.length !== 1 ? "s" : ""}`}
        </Text>

        <InputGroup width="280px">
          <InputLeftElement>
            <Search />
          </InputLeftElement>
          <Input
            placeholder="Search students"
            fontFamily="Lato"
            fontSize="14px"
            borderColor="#B4D6DF"
            onChange={(e) => setSearch(e.target.value)}
          />
        </InputGroup>
      </HStack>

      {isLoading && (
        <VStack spacing="6px" align="stretch">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} height="62px" borderRadius="8px" />
          ))}
        </VStack>
      )}

      {!isLoading && isError && (
        <Box
          p={5}
          textAlign="center"
          borderRadius="8px"
          borderWidth="1px"
          borderColor="#FC8181"
          bg="#FFF5F5"
        >
          <Text fontFamily="Lato" color="#C53030" fontSize="14px">
            Failed to load students.
          </Text>
        </Box>
      )}

      {!isLoading && !isError && students.length === 0 && (
        <Box
          p={5}
          textAlign="center"
          borderRadius="8px"
          borderWidth="1px"
          borderColor="#D7E8EE"
          bg="#F5F7F9"
        >
          <Text fontFamily="Lato" color="#718096" fontSize="14px">
            {search.trim()
              ? "No students match your search."
              : "No students found."}
          </Text>
        </Box>
      )}

      {!isLoading && !isError && students.length > 0 && (
        <>
          <Box
            mb={2}
            width="full"
            height="48px"
            bgColor="var(--brand-secondary, #DDECF7)"
            borderRadius="8px"
          >
            <HStack px="20px" height="full">
              <Text flex={2} fontFamily="Lato" fontSize="14px" color="#434645" fontWeight="medium">
                Student
              </Text>
              <Text flex={2} fontFamily="Lato" fontSize="14px" color="#434645" fontWeight="medium">
                Email
              </Text>
              <Text flex={1} fontFamily="Lato" fontSize="14px" color="#434645" fontWeight="medium">
                Phone
              </Text>
              <Box w="110px" />
            </HStack>
          </Box>

          <VStack spacing="6px" align="stretch">
            {students.map((student) => (
              <Box
                key={student.id}
                px="20px"
                py="12px"
                width="full"
                bgColor="white"
                borderColor="#D7E8EE"
                borderWidth="1px"
                borderRadius="8px"
              >
                <HStack>
                  <HStack flex={2} spacing={3} minW={0}>
                    <Avatar
                      size="sm"
                      name={fullName(student)}
                      src={student.image ?? undefined}
                      bg="var(--brand-secondary, #DDECF7)"
                      color="var(--brand-primary, #0070C1)"
                    />
                    <Text fontFamily="Lato" fontSize="14px" isTruncated>
                      {fullName(student)}
                    </Text>
                  </HStack>

                  <Text
                    flex={2}
                    fontFamily="Lato"
                    fontSize="14px"
                    color="#434645"
                    isTruncated
                  >
                    {student.email}
                  </Text>

                  <Text
                    flex={1}
                    fontFamily="Lato"
                    fontSize="14px"
                    color={student.phone ? "#434645" : "#A0AEC0"}
                    isTruncated
                  >
                    {student.phone ?? "—"}
                  </Text>

                  <Button
                    size="sm"
                    variant="outline"
                    borderColor="var(--brand-primary, #0070C1)"
                    color="var(--brand-primary, #0070C1)"
                    fontFamily="Lato"
                    fontSize="13px"
                    borderRadius="6px"
                    w="110px"
                    _hover={{ bg: "var(--brand-secondary, #DDECF7)" }}
                    onClick={() =>
                      navigate(
                        UserRoutes.studentCourse.replace(
                          ":id",
                          String(student.id),
                        ),
                      )
                    }
                  >
                    View details
                  </Button>
                </HStack>
              </Box>
            ))}
          </VStack>
        </>
      )}
    </Box>
  );
}
