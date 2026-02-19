import { AdminRoutes, SchoolAdminRoutes } from "constants/routes";
import { useModalStore  } from "stores/modalStore";

export const useCreateModal = (pathname: string) => {
  const { openModal } = useModalStore ();

  return () => {
    
    if (pathname === AdminRoutes.districts) {
      openModal("CREATE_DISTRICT");
      return;
    }

    if (pathname === AdminRoutes.schools) {
      openModal("CREATE_SCHOOL");
      return;
    }
    
    if (pathname === AdminRoutes.users) {
      openModal("CREATE_USER");
      return
    }
    
    if (pathname === SchoolAdminRoutes.users || pathname === SchoolAdminRoutes.students) {
      openModal("CREATE_USER");
      return
    }

  };
};
