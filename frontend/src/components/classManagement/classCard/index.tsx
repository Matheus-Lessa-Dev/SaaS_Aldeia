export default function ClassCard(props: {
  name: string;
  students: number;
  href: string;
}) {
  return (
    <a href={props.href} className="classCard">
      <h4 className="classCardTitle">{props.name}</h4>
      <p className="classCardDescription">{props.students} alunos</p>
    </a>
  );
}
