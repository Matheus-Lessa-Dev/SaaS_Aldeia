import { useEffect, useMemo, useState } from 'react'
import { Play } from 'lucide-react'
import StudentSidebar from '../../solos/sideBar/StudentSidebar'
import Header from '../../shared/Header'
import api from '../../../services/api'
import './Jogos.css'

type JogoResponse = {
    id: number
    nome: string
    imgUrl?: string | null
    tempo?: number | null
    linkUrl?: string | null
}

function AlunoJogos() {
    const [jogos, setJogos] = useState<JogoResponse[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        async function fetchJogos() {
            try {
                const { data } = await api.get<JogoResponse[]>('/jogos/minha-turma')
                setJogos(data)
            } catch {
                setError('Erro ao carregar jogos da sua turma.')
            } finally {
                setLoading(false)
            }
        }

        fetchJogos()
    }, [])

    const jogoDestaque = jogos[0]
    const jogoSecundario = jogos[1]
    const jogosGrid = useMemo(() => jogos.slice(2), [jogos])

    const handlePlay = (linkUrl?: string | null) => {
        if (!linkUrl) return
        window.open(linkUrl, '_blank', 'noopener,noreferrer')
    }

    const renderThumb = (jogo: JogoResponse, className: string) => (
        <div
            className={className}
            style={jogo.imgUrl ? { backgroundImage: `url(${jogo.imgUrl})` } : undefined}
        />
    )

    return (
        <div className="jogosPage">
            <StudentSidebar />

            <div className="jogosMain">
                <Header />

                <div className="jogosContent">
                    <div className="jogosPageHeader">
                        <h1>Área de Jogos</h1>
                        <p>
                            Escolha um jogo liberado para sua turma e continue sua jornada de aprendizagem.
                        </p>
                    </div>

                    {loading && <p className="jogosStateMessage">Carregando jogos...</p>}
                    {!loading && error && <p className="jogosStateMessage">{error}</p>}
                    {!loading && !error && jogos.length === 0 && (
                        <p className="jogosStateMessage">Nenhum jogo foi liberado para sua turma ainda.</p>
                    )}

                    {!loading && !error && jogos.length > 0 && (
                        <>
                            <div className="jogosFeaturedRow">
                                {jogoDestaque && (
                                    <div className="jogosFeaturedCard">
                                        <div className="jogosFeaturedThumbWrap">
                                            {renderThumb(jogoDestaque, 'jogosFeaturedThumb')}
                                            <span className="jogosTagNovo">NOVO</span>
                                        </div>
                                        <div className="jogosFeaturedInfo">
                                            <div>
                                                <h3>{jogoDestaque.nome}</h3>
                                                <p>{jogoDestaque.tempo ? `${jogoDestaque.tempo} minutos estimados` : 'Jogo liberado para sua turma.'}</p>
                                            </div>
                                            <button className="jogosBtnJogar" onClick={() => handlePlay(jogoDestaque.linkUrl)}>
                                                Jogar
                                                <Play size={13} aria-hidden="true" />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {jogoSecundario && (
                                    <div className="jogosSideCard">
                                        {renderThumb(jogoSecundario, 'jogosSideThumb')}
                                        <div className="jogosSideInfo">
                                            <div>
                                                <h3>{jogoSecundario.nome}</h3>
                                                <p>{jogoSecundario.tempo ? `${jogoSecundario.tempo} minutos estimados` : 'Disponível agora.'}</p>
                                            </div>
                                            <button className="jogosBtnJogarFull" onClick={() => handlePlay(jogoSecundario.linkUrl)}>
                                                Jogar
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="jogosGrid">
                                {jogosGrid.map((jogo) => (
                                    <div key={jogo.id} className="jogosGridCard">
                                        {renderThumb(jogo, 'jogosGridThumb')}
                                        <div className="jogosGridInfo">
                                            <h3>{jogo.nome}</h3>
                                            <p>{jogo.tempo ? `${jogo.tempo} minutos estimados` : 'Disponível para jogar.'}</p>
                                            <button className="jogosBtnJogarFull" onClick={() => handlePlay(jogo.linkUrl)}>
                                                Jogar
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AlunoJogos
