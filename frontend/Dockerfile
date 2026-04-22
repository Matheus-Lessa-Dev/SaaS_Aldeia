FROM node:20-alpine

WORKDIR /app

# Copia os arquivos de configuração
COPY package*.json ./

# Força a instalação para a arquitetura do container (Linux)
RUN npm install

# Copia o resto dos arquivos
COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]