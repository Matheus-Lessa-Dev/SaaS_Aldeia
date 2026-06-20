import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { FeedbackType } from "../components/shared/FeedbackMessage";
import { useToast } from "../context/ToastContext";

export type RouteFeedback = {
  type?: FeedbackType;
  title?: string;
  message: string;
};

type LocationState = {
  feedback?: RouteFeedback;
};

export function useRouteFeedback() {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [feedback, setFeedback] = useState<RouteFeedback | null>(null);

  useEffect(() => {
    const state = location.state as LocationState | null;
    if (!state?.feedback) return;

    setFeedback(state.feedback);
    showToast(state.feedback);
    navigate(`${location.pathname}${location.search}`, {
      replace: true,
      state: { ...state, feedback: undefined },
    });
  }, [location.pathname, location.search, location.state, navigate, showToast]);

  return { feedback, setFeedback };
}

