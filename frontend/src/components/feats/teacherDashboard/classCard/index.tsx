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
    <a className="classCard" href={href}>
      <h3>{name}</h3>
      <p>{description}</p>
      <p>Alunos: {alunos}</p>
    </a>
  );
}
