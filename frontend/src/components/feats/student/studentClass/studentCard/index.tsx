import "./style.css";

export default function StudentCard(props: { name: string }) {
  return (
    <div className="studentCard">
      <div className="cardContent">
        <h4 className="studentCardTitle">{props.name}</h4>
      </div>
    </div>
  );
}
