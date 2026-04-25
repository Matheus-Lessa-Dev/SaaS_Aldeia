export default function StudentCard(props: {
  name: string;
  href: string;
}) {
  return (
    <a href={props.href} className="classCard">
      <h4 className="classCardTitle">{props.name}</h4>
    </a>
  );
}
