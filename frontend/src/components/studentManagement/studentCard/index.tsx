import "./style.css";

export default function StudentCard(props: { name: string }) {
  return (
    <div className="studentCardContainer">
      <h4>{props.name}</h4>
    </div>
  );
}
