import { X } from "lucide-react";
import "./style.css";

export default function ProfileModal(props: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!props.isOpen) {
    return null;
  }

  const handleClose = () => {
    props.onClose();
  };

  return (
    <div className="profile-modal" onClick={handleClose}>
      <div
        className="profile-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <X size={30} className="close-icon" onClick={handleClose} />
        <h2>Profile Modal</h2>
        <p>This is a placeholder for the profile modal content.</p>
      </div>
    </div>
  );
}
