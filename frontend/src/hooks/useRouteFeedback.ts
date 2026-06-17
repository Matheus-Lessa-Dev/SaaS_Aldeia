import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { FeedbackType } from "../components/shared/FeedbackMessage";

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
  const [feedback, setFeedback] = useState<RouteFeedback | null>(() => {
    const state = location.state as LocationState | null;
    return state?.feedback ?? null;
  });

  useEffect(() => {
    const state = location.state as LocationState | null;
    if (!state?.feedback) return;

    setFeedback(state.feedback);
    navigate(`${location.pathname}${location.search}`, {
      replace: true,
      state: { ...state, feedback: undefined },
    });
  }, [location.pathname, location.search, location.state, navigate]);

  return { feedback, setFeedback };
}

