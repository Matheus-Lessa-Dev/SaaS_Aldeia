import "./style.css";

export default function ClassCard({
  name,
  description,
  alunos,
  href = "#",
}: {
  name: string;
  description: string;
  alunos: number;
  href?: string;
}) {
  return (
    <a className="teacherDashboardClassCard" href={href}>
      <h3 className="teacherDashboardClassCardTitle">{name}</h3>
      <p className="teacherDashboardClassCardDescription">{description}</p>
      <p className="teacherDashboardClassCardStudents">Alunos: {alunos}</p>
    </a>
  );
}
