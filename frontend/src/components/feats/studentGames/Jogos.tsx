import { useEffect, useState } from 'react'
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
        document.body.classList.add('studentGamesRootPage')

        return () => {
            document.body.classList.remove('studentGamesRootPage')
        }
    }, [])

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
                        <div className="jogosGrid">
                            {jogos.map((jogo) => (
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
                    )}
                </div>
            </div>
        </div>
    )
}

export default AlunoJogos
