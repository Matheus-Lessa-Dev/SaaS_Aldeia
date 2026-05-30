param(
    [string]$ApiBaseUrl = "http://localhost:8080"
)

$ErrorActionPreference = "Stop"

function Invoke-SeedPost {
    param(
        [string]$Path,
        [hashtable]$Body,
        [string]$Label
    )

    $json = $Body | ConvertTo-Json -Depth 5

    try {
        Invoke-RestMethod `
            -Method Post `
            -Uri "$ApiBaseUrl$Path" `
            -ContentType "application/json" `
            -Body $json | Out-Null

        Write-Host "[OK] $Label"
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        $responseMessage = ""

        try {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $responseMessage = $reader.ReadToEnd()
        } catch {
            $responseMessage = $_.Exception.Message
        }

        if ($statusCode -eq 400 -and $responseMessage -like "*Email*") {
            Write-Host "[SKIP] $Label ja existe"
            return
        }

        throw
    }
}

Write-Host "Populando banco de desenvolvimento em $ApiBaseUrl"

Invoke-SeedPost `
    -Path "/auth/register/admin" `
    -Label "admin@teste.com" `
    -Body @{
        email = "admin@teste.com"
        senha = "123123"
        nome = "Administrador Aldeia"
    }

$professores = @(
    @{ nome = "Ana Ribeiro"; dataNascimento = "1986-01-12"; telefone = "(11) 90000-1001" },
    @{ nome = "Bruno Carvalho"; dataNascimento = "1984-02-18"; telefone = "(11) 90000-1002" },
    @{ nome = "Camila Santos"; dataNascimento = "1990-03-24"; telefone = "(11) 90000-1003" },
    @{ nome = "Daniel Oliveira"; dataNascimento = "1982-04-09"; telefone = "(11) 90000-1004" },
    @{ nome = "Eduarda Lima"; dataNascimento = "1989-05-15"; telefone = "(11) 90000-1005" },
    @{ nome = "Felipe Costa"; dataNascimento = "1987-06-21"; telefone = "(11) 90000-1006" },
    @{ nome = "Gabriela Martins"; dataNascimento = "1991-07-30"; telefone = "(11) 90000-1007" },
    @{ nome = "Henrique Almeida"; dataNascimento = "1983-08-11"; telefone = "(11) 90000-1008" },
    @{ nome = "Isabela Rocha"; dataNascimento = "1988-09-27"; telefone = "(11) 90000-1009" },
    @{ nome = "Joao Pereira"; dataNascimento = "1985-10-05"; telefone = "(11) 90000-1010" }
)

for ($i = 0; $i -lt $professores.Count; $i++) {
    $numero = ($i + 1).ToString("00")
    $professor = $professores[$i]

    Invoke-SeedPost `
        -Path "/auth/register/professor" `
        -Label "professor$numero@aldeia.com" `
        -Body @{
            email = "professor$numero@aldeia.com"
            nome = $professor.nome
            dataNascimento = $professor.dataNascimento
            rua = "Rua dos Educadores, $($i + 1)"
            complemento = "Sala $($i + 1)"
            telefone = $professor.telefone
        }
}

$nomesAlunos = @(
    "Alice Souza", "Bernardo Lima", "Clara Mendes", "Davi Rocha", "Elisa Nunes",
    "Fernando Alves", "Giovana Castro", "Heitor Martins", "Isadora Freitas", "Joao Batista",
    "Laura Gomes", "Miguel Araujo", "Nicolas Barros", "Olivia Cardoso", "Pedro Henrique",
    "Rafaela Dias", "Samuel Ribeiro", "Sofia Teixeira", "Theo Fernandes", "Valentina Lopes",
    "Arthur Moreira", "Beatriz Correia", "Caio Duarte", "Daniela Campos", "Enzo Vieira",
    "Fernanda Reis", "Guilherme Melo", "Helena Pires", "Igor Batista", "Julia Monteiro",
    "Kaique Silva", "Livia Barbosa", "Manuela Prado", "Noah Andrade", "Otavio Cunha",
    "Pietra Farias", "Raul Matos", "Sara Cavalcante", "Tiago Rezende", "Vitoria Macedo"
)

for ($i = 0; $i -lt $nomesAlunos.Count; $i++) {
    $numero = ($i + 1).ToString("00")
    $dia = (($i % 27) + 1).ToString("00")
    $mes = ((($i % 12) + 1)).ToString("00")
    $ano = 2011 + ($i % 4)
    $dataNascimento = "$ano-$mes-$dia"

    Invoke-SeedPost `
        -Path "/auth/register/aluno" `
        -Label "aluno$numero@aldeia.com" `
        -Body @{
            email = "aluno$numero@aldeia.com"
            nome = $nomesAlunos[$i]
            dataNascimento = $dataNascimento
            rua = "Rua das Palmeiras, $($i + 1)"
            complemento = "Casa $($i + 1)"
            nomeResponsavel = "Responsavel $numero"
            telefoneResponsavel = "(11) 98888-$($numero)00"
            emailResponsavel = "responsavel$numero@aldeia.com"
        }
}

Write-Host ""
Write-Host "Seed finalizada."
Write-Host "Admin: admin@teste.com / 123123"
Write-Host "Professores e alunos usam senha inicial no formato ddMMyyyy da data de nascimento."
