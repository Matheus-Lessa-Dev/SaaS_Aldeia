import { useEffect, useState } from "react";
import { GraduationCap, Users, BookOpen } from "lucide-react";
import Sidebar from "../../solos/sideBar/DefaultSidebar";
import Calendario from "../../solos/calendario/Calendario";
import api from "../../../services/api";
import Header from "../../shared/Header";
import "./Dashboard.css";

const dashboardCards = [
  { title: "Total de Alunos", key: "students", icon: Users },
  { title: "Total de Professores", key: "teachers", icon: GraduationCap },
  { title: "Total de Turmas", key: "classes", icon: BookOpen },
] as const;

type DashboardTotals = {
  students: number;
  teachers: number;
  classes: number;
};

type CountUpProps = {
  value: number;
  isReady: boolean;
};

function CountUp({ value, isReady }: CountUpProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isReady) {
      setDisplayValue(0);
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion || value === 0) {
      setDisplayValue(value);
      return;
    }

    const duration = 900;
    const startTime = performance.now();

    function animate(currentTime: number) {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      setDisplayValue(Math.round(value * easedProgress));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    const animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [isReady, value]);

  return <>{displayValue}</>;
}

function AdminDashboard() {
  const [totals, setTotals] = useState<DashboardTotals>({
    students: 0,
    teachers: 0,
    classes: 0,
  });
  const [loadingTotals, setLoadingTotals] = useState(true);
  const [totalsError, setTotalsError] = useState("");

  useEffect(() => {
    document.body.classList.add("adminDashboardPage");

    return () => {
      document.body.classList.remove("adminDashboardPage");
    };
  }, []);

  useEffect(() => {
    async function fetchDashboardTotals() {
      try {
        const [studentsRes, teachersRes, classesRes] = await Promise.all([
          api.get<unknown[]>("/alunos"),
          api.get<unknown[]>("/professores"),
          api.get<unknown[]>("/turmas"),
        ]);

        setTotals({
          students: studentsRes.data.length,
          teachers: teachersRes.data.length,
          classes: classesRes.data.length,
        });
        setTotalsError("");
      } catch {
        setTotalsError("Erro ao carregar totais.");
      } finally {
        setLoadingTotals(false);
      }
    }

    fetchDashboardTotals();
  }, []);

  return (
    <div className="dashBoardPainel">
      <Sidebar />
      <div className="dashboardLayout">
        <Header />
        <main className="dashboardContent">
          <h1>Bom dia, educador!</h1>
          <h4>Acompanhe as informações gerais do sistema</h4>
          <div className="dashboardContentCards">
            {dashboardCards.map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.title} className="dashboardCard">
                  <h3>{card.title}</h3>
                  <p>
                    <CountUp
                      value={totals[card.key]}
                      isReady={!loadingTotals}
                    />
                  </p>
                  <div className="dashboardCardIcon">
                    <Icon size={32} aria-hidden="true" />
                  </div>
                </div>
              );
            })}
          </div>
          {totalsError && (
            <p className="dashboardError" role="alert">
              {totalsError}
            </p>
          )}
          <div className="dashboardContentBottom">
            <div className="bannerPlaceholder"></div>
            <Calendario />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
