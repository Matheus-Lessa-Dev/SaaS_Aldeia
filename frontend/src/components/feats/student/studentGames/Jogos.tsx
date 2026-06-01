import { UserCircle, Play } from "lucide-react";
import SideBar from "../../../solos/sideBar/SideBar2";
import "./Jogos.css";

type Jogo = {
  id: number;
  titulo: string;
  descricao: string;
  status: "disponivel" | "bloqueado";
  destaque?: boolean;
  novo?: boolean;
};

const jogos: Jogo[] = [
  {
    id: 1,
    titulo: "Nome do jogo",
    descricao:
      "Encontre as palavras sagradas escondidas entre as copas das árvores centenárias.",
    status: "disponivel",
    destaque: true,
    novo: true,
  },
  {
    id: 2,
    titulo: "Nome do jogo",
    descricao:
      "Proteja as águas cristalinas e aprenda sobre a fauna aquática local.",
    status: "disponivel",
  },
  {
    id: 3,
    titulo: "Nome do jogo",
    descricao: "Aguardando liberação do professor para iniciar esta jornada.",
    status: "bloqueado",
  },
  {
    id: 4,
    titulo: "Nome do jogo",
    descricao: "Explore as formas e significados dos grafismos tradicionais.",
    status: "disponivel",
  },
  {
    id: 5,
    titulo: "Nome do jogo",
    descricao: "Seu professor ainda está preparando este conteúdo.",
    status: "bloqueado",
  },
];

const jogoDestaque = jogos.find((j) => j.destaque);
const jogoSecundario = jogos.find(
  (j) => !j.destaque && j.status === "disponivel",
);
const jogosGrid = jogos.filter(
  (j) => !j.destaque && j.id !== jogoSecundario?.id,
);

function AlunoJogos() {
  return (
    <div className="jogosPage">
      <SideBar />

      {/* MAIN */}
      <div className="jogosMain">
        {/* TOP BAR */}
        <div className="jogosTopBar">
          <h2>Jogos</h2>
          <button className="jogosProfileBtn">
            Prof. Arandú
            <UserCircle size={20} aria-hidden="true" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="jogosContent">
          <div className="jogosPageHeader">
            <h1>Área de Jogos</h1>
            <p>
              Aprenda com a sabedoria da floresta. Escolha um desafio e
              fortaleça seu conhecimento ancestral.
            </p>
          </div>

          {/* Card destaque + card lateral */}
          <div className="jogosFeaturedRow">
            {jogoDestaque && (
              <div className="jogosFeaturedCard">
                <div className="jogosFeaturedThumb">
                  {jogoDestaque.novo && (
                    <span className="jogosTagNovo">NOVO</span>
                  )}
                </div>
                <div className="jogosFeaturedInfo">
                  <div>
                    <h3>{jogoDestaque.titulo}</h3>
                    <p>{jogoDestaque.descricao}</p>
                  </div>
                  <button className="jogosBtnJogar">
                    Jogar
                    <Play size={13} aria-hidden="true" />
                  </button>
                </div>
              </div>
            )}

            {jogoSecundario && (
              <div className="jogosSideCard">
                <div className="jogosSideThumb" />
                <div className="jogosSideInfo">
                  <div>
                    <h3>{jogoSecundario.titulo}</h3>
                    <p>{jogoSecundario.descricao}</p>
                  </div>
                  <button className="jogosBtnJogarFull">Jogar</button>
                </div>
              </div>
            )}
          </div>

          {/* Grid de 3 cards */}
          <div className="jogosGrid">
            {jogosGrid.map((jogo) => (
              <div key={jogo.id} className="jogosGridCard">
                <div className="jogosGridThumb" />
                <div className="jogosGridInfo">
                  <h3 className={jogo.status === "bloqueado" ? "locked" : ""}>
                    {jogo.titulo}
                  </h3>
                  <p>{jogo.descricao}</p>
                  {jogo.status === "disponivel" ? (
                    <button className="jogosBtnJogarFull">Jogar</button>
                  ) : (
                    <button className="jogosBtnBloqueado" disabled>
                      Bloqueado
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AlunoJogos;
