import DeleteModal from "components/ui/modal/delete";
import { useModalStore } from "stores/modalStore";
import { Text } from "@chakra-ui/react";
import { useUpdateDistricts, useGetDistrictById } from "api/admin/districts/hooks";
import { ToastComponent } from "components/ui/toast";

type DeleteAssignSchoolPayload = {
  districtId: number | null;
  schoolId: number;
};

export default function RemoveSchoolFromDistrictModal() {
  const { type, payload, closeModal } = useModalStore();
  const isOpen = type === "DELETE_ASSIGN_SCHOOL";
  const toast = ToastComponent();
  const districtId = (payload as DeleteAssignSchoolPayload | undefined)?.districtId ?? null;
  const schoolId = (payload as DeleteAssignSchoolPayload | undefined)?.schoolId;

  const { mutate: updateDistrict, isPending } = useUpdateDistricts();

  const { data: district, isFetching } = useGetDistrictById(districtId ?? 0);

    const handleClose = () => {
      closeModal();
      toast("School successfully deleted")
    } ;
    const onConfirm = () => {
      if (!district || !schoolId) return;

    const nextSchoolIds = district.schools?.filter((s) => s.id !== schoolId).map((s) => s.id) ?? [];

    const getErrorMessage = (err: unknown) => {
      const anyErr = err as any;
      return (
        anyErr?.response?.data?.message ||
        anyErr?.response?.data?.error ||
        anyErr?.message ||
        "Something went wrong"
        );
      };

    updateDistrict({
      id: district.id,
      name: district.name,
      title: district.title ?? "",
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



  if (!isOpen) return null;

  return (
    <DeleteModal
      isOpen={isOpen}
      title="Remove School from District"
      onClose={closeModal}
      onConfirm={onConfirm}
      isLoading={isPending || isFetching}
      isDisabled={!district || !schoolId}
    >
      <Text textAlign="center">
        Are you sure you want to remove this school from the district?
      </Text>
    </DeleteModal>
  );
}
