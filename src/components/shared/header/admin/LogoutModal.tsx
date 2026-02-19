import { useCallback } from "react";
import Modal from "components/ui/modal";
import { MainButton } from "components/ui/button";
import { useLogoutModal } from "./hooks/useLogoutModal";
import { localStore } from "stores/localStore";
import { authStore } from "stores/authStore";

export const LogoutModal = () => {
  const { isOpen, toggleModal } = useLogoutModal();
  const clearToken = localStore((store) => store.clearToken);
  const setUser = authStore((store) => store.setUser);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
    toggleModal();
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      onClose={toggleModal}
      title="Log out"
      subTitle="Are you sure you want to log out?"
    >
      <div className="flex items-center gap-4 justify-center">
        <MainButton
          className="text-dark-text! border-dark-text!"
          variant="outline"
          onClick={toggleModal}
        >
          Cancel
        </MainButton>
        <MainButton
          onClick={logout}
        >
          Log out
        </MainButton>
      </div>
    </Modal>
  );
};
