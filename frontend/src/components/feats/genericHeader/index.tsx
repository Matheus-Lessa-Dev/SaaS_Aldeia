import "./style.css";

export default function GenericHeader(props: { title: string }) {
  return (
    <header className="headerContainer">
      <h1 className="headerTitle">{props.title}</h1>
      <a href="" className="headerProfileBtn"></a>
    </header>
  );
}
