import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../../../hooks/useSearch";
import ManagementPageShell from "../../shared/ManagementPageShell";
import GameCard from "./gameCard";
import api from "../../../services/api";
import "./style.css";

interface GameInfo {
  id: number;
  name: string;
  time?: number;
  imageUrl?: string;
  linkUrl?: string;
  enabled: boolean;
  href: string;
}

interface JogoResponse {
  id: number;
  nome: string;
  imgUrl?: string;
  tempo?: number;
  linkUrl?: string;
  habilitado?: boolean;
}

export default function GameManagement() {
  const navigate = useNavigate();
  const [games, setGames] = useState<GameInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { searchTerm, setSearchTerm, filteredItems } = useSearch(games);

  useEffect(() => {
    fetchGames();
  }, []);

  async function fetchGames() {
    try {
      const { data } = await api.get<JogoResponse[]>("/jogos");
      setGames(
        data.map((jogo) => ({
          id: jogo.id,
          name: jogo.nome,
          time: jogo.tempo,
          imageUrl: jogo.imgUrl,
          linkUrl: jogo.linkUrl,
          enabled: jogo.habilitado ?? true,
          href: `/jogos/${jogo.id}/editar`,
        })),
      );
    } catch {
      setError("Erro ao carregar jogos.");
    } finally {
      setLoading(false);
    }
  }

  const handleDeleteGame = async (gameInfo: GameInfo) => {
    try {
      await api.delete(`/jogos/${gameInfo.id}`);
      setGames((prev) => prev.filter((game) => game.id !== gameInfo.id));
    } catch {
      alert("Erro ao deletar jogo. Tente novamente.");
    }
  };

  const handleToggleGame = async (gameInfo: GameInfo, enabled: boolean) => {
    setGames((prev) =>
      prev.map((game) => (game.id === gameInfo.id ? { ...game, enabled } : game)),
    );

    try {
      await api.put(`/jogos/${gameInfo.id}`, {
        nome: gameInfo.name,
        tempo: gameInfo.time ?? null,
        imgUrl: gameInfo.imageUrl ?? "",
        linkUrl: gameInfo.linkUrl ?? "",
        habilitado: enabled,
      });
    } catch {
      setGames((prev) =>
        prev.map((game) =>
          game.id === gameInfo.id ? { ...game, enabled: gameInfo.enabled } : game,
        ),
      );
      alert("Erro ao atualizar status do jogo. Tente novamente.");
    }
  };

  const gameElements = filteredItems.map((gameInfo) => (
    <GameCard
      key={gameInfo.id}
      name={gameInfo.name}
      time={gameInfo.time}
      enabled={gameInfo.enabled}
      href={gameInfo.href}
      onToggleEnabled={(enabled) => handleToggleGame(gameInfo, enabled)}
      onDelete={() => handleDeleteGame(gameInfo)}
      onEdit={() => navigate(`/jogos/${gameInfo.id}/editar`)}
    />
  ));

  const listElements = error
    ? [<p key="games-error" className="classesListEmpty">{error}</p>]
    : loading
      ? []
      : gameElements;

  return (
    <ManagementPageShell
      pageClassName="gameManagementPage"
      layoutClassName="managementPageLayout"
      title="Jogos"
      itemsPerPage={6}
      addButtonLabel="Adicionar Jogo"
      searchPlaceholder="Pesquisar Jogo"
      searchValue={searchTerm}
      onSearchChange={setSearchTerm}
      onAddClick={() => navigate("/jogos/novo")}
    >
      {listElements}
    </ManagementPageShell>
  );
}
