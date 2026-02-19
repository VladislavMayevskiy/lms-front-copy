import { useEffect, useState } from "react";
import { useLocation, useSearchParams, useNavigate } from "react-router-dom";

type Props = {
  hasUnsavedChanges: boolean;
  openModal: () => void;
  closeModal: () => void;
};

export const useRouteChangePrompt = ({ hasUnsavedChanges, openModal, closeModal }: Props) => {
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const searchParams = useSearchParams();

  useEffect(() => {
    const currentUrl = pathname;
    
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!hasUnsavedChanges) return;
      e.preventDefault();
    };

    const handleAnchorClick = (e: MouseEvent): any => {
      const target = e.currentTarget as HTMLAnchorElement;
      if (hasUnsavedChanges && target.href !== currentUrl) {
        e.preventDefault();
        setPendingNavigation(target.href);
        openModal();
      }
    };

    const anchors: NodeListOf<HTMLAnchorElement> = document.querySelectorAll('a[href]');

    anchors.forEach(anchor => {
      anchor.addEventListener('click', handleAnchorClick);
    });

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      anchors.forEach(anchor => {
        anchor.removeEventListener('click', handleAnchorClick);
      });
    };
  }, [hasUnsavedChanges, pathname, searchParams, navigate]);

  const confirmNavigation = () => {
    closeModal();

    if (pendingNavigation) {
      navigate(pendingNavigation);
    }
  };

  const cancelNavigation = () => {
    closeModal();
    setPendingNavigation(null);
  };

  return { confirmNavigation, cancelNavigation };
};
