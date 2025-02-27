import { Modal } from "../Modal";

interface SavedSearchPromoDialogProps {
  isOpen: boolean;
  onClose: () => void;
}
export default function SavedSearchPromoDialog({
  isOpen,
  onClose,
}: SavedSearchPromoDialogProps) {
  return (
    <Modal isOpen={isOpen} title="Save your search" onClose={onClose}>
      <div>SavedSearchPromoDialog</div>
    </Modal>
  );
}
