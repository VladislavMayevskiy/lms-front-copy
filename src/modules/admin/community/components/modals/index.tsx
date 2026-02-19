import {
  ModalBody,
  Button,
  Box,
  Text,
  VStack,
  Checkbox,
  HStack,
} from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import Modal from "components/ui/modal";
import Chevron from "assets/imgs/admin/modal/chevron.svg?react";
import { useUpdateDistricts } from "api/admin/districts/hooks";
import { useGetDistrictById } from "api/admin/districts/hooks";
import { useModalStore } from "stores/modalStore";
import { useGetSchools } from "api/admin/schools/hooks";
import X from "assets/imgs/admin/modal/deleteSchool.svg?react"
import { useParams } from "react-router-dom";
import { ToastComponent } from "components/ui/toast";
type FormSchema = { schoolId: number | null };

export default function CommunityModal() {
  const { type, payload, closeModal } = useModalStore ();
  const { districtId: districtIdParam } = useParams();
  const toast = ToastComponent();
  const districtIdNumber =
    typeof payload?.districtId === "number"
      ? payload.districtId
      : districtIdParam
      ? Number(districtIdParam)
      : null;
  

  const isOpen = type === "ASSIGN_SCHOOL";
  const { data: district } = useGetDistrictById(districtIdNumber ?? 0);
  const { mutate: updateDistrict, isPending } = useUpdateDistricts();
  const { data: schoolsResponse } = useGetSchools();
  const schoolsList = schoolsResponse?.data || [];

  const disabledIds = schoolsList
  .filter(s => s.district_id !== null)
  .map(s => s.id);


  const { control, handleSubmit, reset, watch } = useForm<FormSchema>({
    defaultValues: { schoolId: null },
  });

  const selectedSchoolId = watch("schoolId");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleClose = () => {
    reset({ schoolId: null });
    setDropdownOpen(false);
    closeModal();
    toast("School successfully added")
  };

   const getErrorMessage = (err: unknown) => {
      const anyErr = err as any;
      return (
        anyErr?.response?.data?.message ||
        anyErr?.response?.data?.error ||
        anyErr?.message ||
        "Something went wrong"
        );
      };

  const onSubmit = ({ schoolId }: FormSchema) => {
    if (!schoolId || !district) return;

  const currentSchoolIds =
    district.schools?.map(s => s.id) ?? [];

  const nextSchoolIds = Array.from(
    new Set([...currentSchoolIds, schoolId])
  );

  const safeTitle =
    district.title?.trim() ||
    district.name?.trim() ||
    "District";

  updateDistrict({
    id: district.id,
    name: district.name,
    title: safeTitle,
    phone: district.phone,
    email: district.email,
    schools: nextSchoolIds,
    logo: null,
  },
  {
    onSuccess: handleClose,
    onError: (error) => {toast(getErrorMessage(error))}
  });
};


  useEffect(() => {
    if (!isOpen) return;
    reset({ schoolId: null });
    setDropdownOpen(false);
  }, [isOpen, reset]);

  return (
    <Modal isOpen={isOpen} onClose={closeModal} title="Add school">
      <ModalBody as="form" onSubmit={handleSubmit(onSubmit)} mt="10px">
        <VStack align="stretch" spacing="16px">
          <Controller
            control={control}
            name="schoolId"
            render={({ field }) => (
              <VStack align="stretch" spacing="4px" position="relative">
                <Text fontFamily="Lato" fontWeight="bold" fontSize="14px">
                  School(s)*
                </Text>

                <Box
                  borderWidth="1px"
                  borderRadius="10px"
                  borderColor="#B4D6DF"
                  bg="#F5F7F9"
                  minH="44px"
                  px="12px"
                  py="6px"
                  cursor="pointer"
                  position="relative"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                >
                  
                 <HStack justify={"space-between"}>
{field.value ? (
  <Box
    bg="white"
    borderRadius="8px"
    px="8px"
    height="31px"
    borderWidth="1px"
    borderColor="#B4D6DF"
    display="flex"
    alignItems="center"
    gap="6px"
  >
    <Text fontSize="14px" color="#000" mt="0">
      {schoolsList.find((s: any) => s.id === field.value)?.name}
    </Text>

    <Box
      cursor="pointer"
      onClick={(e) => {
        e.stopPropagation();
        field.onChange(null);
      }}
    >
      <X />
    </Box>
  </Box>
) : (
  <Text
    fontSize="14px"
    color="#0070C1"
    cursor="pointer"
    onClick={() => setDropdownOpen(prev => !prev)}
    mt={1}
  >
    Select school(s)
  </Text>
)}


                  <Box
                    position="absolute"
                    right="12px"
                    top="50%"
                    transform={
                      dropdownOpen
                        ? "translateY(-50%) rotate(180deg)"
                        : "translateY(-50%)"
                    }
                    transition="0.2s ease"
                  >
                    <Chevron />
                  </Box>
                  </HStack>
                </Box>

                {dropdownOpen && (
                  <Box
                    position="absolute"
                    top="74px"
                    left="0"
                    zIndex={1000}
                    width="100%"
                    borderRadius="14px"
                    borderWidth="1px"
                    borderColor="#B4D6DF"
                    bg="white"
                    py="10px"
                    px="16px"
                    boxShadow="0 10px 25px rgba(0,0,0,0.15)"
                    maxH="260px"
                    overflowY="auto"
                  >
                    <VStack align="stretch" spacing="8px">
                      {schoolsList.map((school: any) => {
                        const disabled = disabledIds.includes(school.id);

                        return (
                          <HStack
                            key={school.id}
                            spacing="10px"
                            opacity={disabled ? 0.4 : 1}
                            cursor={disabled ? "not-allowed" : "pointer"}
                            onClick={() => {
                              if (disabled) return;
                              field.onChange(school.id);
                              setDropdownOpen(false);
                            }}
                          >
                            <Checkbox
                              isDisabled={disabled}
                              pointerEvents="none"
                              sx={{
                                ".chakra-checkbox__control": {
                                  borderRadius: "5px",
                                  borderColor: "#B4D6DF",
                                  width: "20px",
                                  height: "20px",
                                  borderWidth: "1px",
                                },
                              }}
                            />

                            <Text fontSize="16px" color="#434645">
                              {school.name}
                            </Text>
                          </HStack>
                        );
                      })}
                    </VStack>
                  </Box>
                )}
              </VStack>
            )}
          />

          <Button
            type="submit"
            w="144px"
            h="48px"
            bg="#0070C1"
            color="white"
            borderRadius="10px"
            fontFamily="Lato"
            isDisabled={!selectedSchoolId || isPending}
            isLoading={isPending}
            ml={"245px"}
          >
            Add school
          </Button>
        </VStack>
      </ModalBody>
    </Modal>
  );
}
