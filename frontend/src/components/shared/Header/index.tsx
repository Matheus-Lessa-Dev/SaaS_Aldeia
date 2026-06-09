import { GraduationCap } from "lucide-react";
import useAuth from "../../../hooks/useAuth";
import "./style.css";
import { useState } from "react";
import ProfileModal from "../profileModal";

export default function Header() {
  const auth = useAuth();
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  return (
    <>
      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />
      <header className="header">
        <button
          type="button"
          className="headerBtn"
          onClick={() => setProfileModalOpen(true)}
        >
          <span>{auth.user?.name.split(" ")[0]}</span>
          <GraduationCap size={18} aria-hidden="true" />
        </button>
      </header>
    </>
  );
}
