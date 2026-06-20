param(
    [string]$ApiBaseUrl = "http://localhost:8080"
)

$ErrorActionPreference = "Stop"

function Invoke-SeedPost {
    param(
        [string]$Path,
        [hashtable]$Body,
        [string]$Label,
        [hashtable]$Headers = @{}
    )

    $json = $Body | ConvertTo-Json -Depth 5

    try {
        Invoke-RestMethod `
            -Method Post `
            -Uri "$ApiBaseUrl$Path" `
            -Headers $Headers `
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

        if (($statusCode -eq 400 -or $statusCode -eq 409) -and $responseMessage -like "*Email*") {
            Write-Host "[SKIP] $Label ja existe"
            return
        }

        throw
    }
}

function Invoke-SeedJson {
    param(
        [string]$Method,
        [string]$Path,
        [object]$Body = $null,
        [hashtable]$Headers = @{}
    )

    $params = @{
        Method = $Method
        Uri = "$ApiBaseUrl$Path"
        Headers = $Headers
        ContentType = "application/json"
    }

    if ($null -ne $Body) {
        $params.Body = $Body | ConvertTo-Json -Depth 8
    }

    return Invoke-RestMethod @params
}

function Get-ByEmail {
    param(
        [array]$Items,
        [string]$Email
    )

    return $Items | Where-Object { $_.email -eq $Email } | Select-Object -First 1
}

function Get-ByName {
    param(
        [array]$Items,
        [string]$Name
    )

    return $Items | Where-Object { $_.nome -eq $Name } | Select-Object -First 1
}

Write-Host "Populando banco de desenvolvimento em $ApiBaseUrl"

Write-Host ""
Write-Host "Autenticando admin base..."

$login = Invoke-SeedJson `
    -Method "Post" `
    -Path "/auth/login" `
    -Body @{
        email = "admin@base.com"
        senha = "Aldeia@2026Base!"
    }

$headers = @{
    Authorization = "Bearer $($login.token)"
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
        -Headers $headers `
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
        -Headers $headers `
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

$professoresCriados = @(Invoke-SeedJson -Method "Get" -Path "/professores" -Headers $headers)
$alunosCriados = @(Invoke-SeedJson -Method "Get" -Path "/alunos" -Headers $headers)

$turmasSeed = @(
    @{
        nome = "Turma Alfa"
        periodo = "Manhã"
        professoresEmails = @("professor01@aldeia.com", "professor02@aldeia.com")
        alunosEmails = @("aluno01@aldeia.com", "aluno02@aldeia.com", "aluno03@aldeia.com", "aluno04@aldeia.com", "aluno05@aldeia.com", "aluno06@aldeia.com", "aluno07@aldeia.com", "aluno08@aldeia.com", "aluno09@aldeia.com", "aluno10@aldeia.com")
    },
    @{
        nome = "Turma Beta"
        periodo = "Tarde"
        professoresEmails = @("professor03@aldeia.com", "professor04@aldeia.com")
        alunosEmails = @("aluno11@aldeia.com", "aluno12@aldeia.com", "aluno13@aldeia.com", "aluno14@aldeia.com", "aluno15@aldeia.com", "aluno16@aldeia.com", "aluno17@aldeia.com", "aluno18@aldeia.com", "aluno19@aldeia.com", "aluno20@aldeia.com")
    },
    @{
        nome = "Turma Gama"
        periodo = "Manhã"
        professoresEmails = @("professor05@aldeia.com", "professor06@aldeia.com")
        alunosEmails = @("aluno21@aldeia.com", "aluno22@aldeia.com", "aluno23@aldeia.com", "aluno24@aldeia.com", "aluno25@aldeia.com", "aluno26@aldeia.com", "aluno27@aldeia.com", "aluno28@aldeia.com", "aluno29@aldeia.com", "aluno30@aldeia.com")
    },
    @{
        nome = "Turma Delta"
        periodo = "Tarde"
        professoresEmails = @("professor07@aldeia.com", "professor08@aldeia.com")
        alunosEmails = @("aluno31@aldeia.com", "aluno32@aldeia.com", "aluno33@aldeia.com", "aluno34@aldeia.com", "aluno35@aldeia.com", "aluno36@aldeia.com", "aluno37@aldeia.com", "aluno38@aldeia.com", "aluno39@aldeia.com", "aluno40@aldeia.com")
    }
)

$turmasExistentes = @(Invoke-SeedJson -Method "Get" -Path "/turmas" -Headers $headers)
$turmasCriadas = @()

foreach ($turmaSeed in $turmasSeed) {
    $professoresIds = @(
        foreach ($email in $turmaSeed.professoresEmails) {
            $professor = Get-ByEmail -Items $professoresCriados -Email $email
            if ($null -ne $professor) { [long]$professor.id }
        }
    )

    $turma = Get-ByName -Items $turmasExistentes -Name $turmaSeed.nome

    if ($null -eq $turma) {
        $turma = Invoke-SeedJson `
            -Method "Post" `
            -Path "/turmas" `
            -Headers $headers `
            -Body @{
                nome = $turmaSeed.nome
                periodo = $turmaSeed.periodo
                professoresIds = $professoresIds
                jogosIds = @()
            }
        Write-Host "[OK] Turma $($turmaSeed.nome)"
    } else {
        Write-Host "[SKIP] Turma $($turmaSeed.nome) ja existe"
    }

    $alunosIds = @(
        foreach ($email in $turmaSeed.alunosEmails) {
            $aluno = Get-ByEmail -Items $alunosCriados -Email $email
            if ($null -ne $aluno) { [long]$aluno.id }
        }
    )

    Invoke-SeedJson `
        -Method "Put" `
        -Path "/turmas/$($turma.id)/alunos" `
        -Headers $headers `
        -Body @{
            alunosIds = $alunosIds
        } | Out-Null

    Write-Host "[OK] Alunos vinculados em $($turmaSeed.nome)"
    $turmasCriadas += $turma
}

$chamadasExistentes = @(Invoke-SeedJson -Method "Get" -Path "/chamadas" -Headers $headers)

foreach ($turma in $turmasCriadas) {
    $chamadasTurma = @(
        @{
            nome = "Frequencia 1 Bimestre - $($turma.nome)"
            tipoPeriodo = "BIMESTRE"
            numeroPeriodo = 1
        },
        @{
            nome = "Frequencia 2 Bimestre - $($turma.nome)"
            tipoPeriodo = "BIMESTRE"
            numeroPeriodo = 2
        }
    )

    foreach ($chamadaSeed in $chamadasTurma) {
        $chamada = Get-ByName -Items $chamadasExistentes -Name $chamadaSeed.nome

        if ($null -ne $chamada) {
            Write-Host "[SKIP] Chamada $($chamadaSeed.nome) ja existe"
            continue
        }

        $novaChamada = Invoke-SeedJson `
            -Method "Post" `
            -Path "/chamadas" `
            -Headers $headers `
            -Body @{
                nome = $chamadaSeed.nome
                turmaId = [long]$turma.id
                tipoPeriodo = $chamadaSeed.tipoPeriodo
                numeroPeriodo = $chamadaSeed.numeroPeriodo
            }

        $chamadasExistentes += $novaChamada
        Write-Host "[OK] Chamada $($chamadaSeed.nome)"
    }
}

Write-Host ""
Write-Host "Seed finalizada."
Write-Host "Admin base: admin@base.com / Aldeia@2026Base!"
Write-Host "Professores e alunos usam senha inicial no formato ddMMyyyy da data de nascimento."
Write-Host "Turmas criadas: Turma Alfa, Turma Beta, Turma Gama, Turma Delta."
Write-Host "Chamadas criadas: 1 e 2 bimestre para cada turma."
