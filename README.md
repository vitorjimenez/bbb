
# 🧱 BBB Application — Next.js + Spring Boot + MySQL

Este projeto é composto por dois módulos principais:

- **bbb-app** → Aplicação frontend feita em **Next.js**
- **sboot-user** → API backend feita em **Spring Boot**, com banco de dados **MySQL** e suporte a **Docker**

<img width="800" height="600" alt="image" src="https://github.com/user-attachments/assets/fdfd2ac4-555f-4ade-9aa4-57315c3af0b1" />
<img width="800" height="600" alt="image" src="https://github.com/user-attachments/assets/37ab70a2-4549-4b6e-bb98-ab015341452a" />



---

## 📁 Estrutura de Pastas

```
📦 projeto-bbb
├── 📂 bbb-app           # Frontend (Next.js)
├── 📂 sboot-user        # Backend (Spring Boot)
├── 📄 README.md
```

---

## ⚙️ Pré-requisitos

Antes de iniciar, verifique se você possui instalado:

- Node.js 18+
- Java 21 (Temurin)
- Maven 3.9+
- Docker + Docker Compose

---

## 🐳 1. Subindo o Backend com Docker

O backend (`sboot-user`) contém um `Dockerfile` e `docker-compose.yml` prontos para uso.

### 🚀 Rodar o backend e MySQL

```bash
cd sboot-user
docker-compose up --build
```

Isso irá:
- Criar um container MySQL com o banco `laager`
- Criar e executar o container do backend Spring Boot na porta `8080`

A aplicação Spring Boot ficará acessível em:  
👉 **http://localhost:8080**

---

## 🧠 2. Configuração do Banco de Dados

O banco de dados é configurado automaticamente via variáveis de ambiente no Docker Compose:

```
SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/laager
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=12345
```

Caso queira rodar o Spring Boot localmente (sem Docker), ajuste o arquivo `application.properties` com as mesmas credenciais.

---

## 🖥️ 3. Rodando o Frontend (Next.js)

O frontend está localizado na pasta `bbb-app`.

### 📦 Instalar dependências

```bash
cd bbb-app
npm install
```

### ▶️ Executar o servidor de desenvolvimento

```bash
npm run dev
```

O aplicativo ficará disponível em:  
👉 **http://localhost:3000**

O frontend está configurado para consumir a API do backend em `http://localhost:8080`.

---

## 🔗 4. Integração Frontend ↔ Backend

Endpoints utilizados pelo frontend:

| Recurso | Método | Endpoint | Descrição |
|----------|---------|-----------|------------|
| Usuário  | POST | `/usuario/registro` | Cria um novo usuário |
| Usuário  | POST | `/usuario/login` | Faz login de usuário |
| Participante | GET | `/participante/todos` | Lista todos os participantes |
| Participante | POST | `/participante/registro` | Cadastra um novo participante |
| Voto | POST | `/voto/registrar` | Registra um voto |
| Voto | GET | `/voto/por-participante` | Retorna votos por participante |
| Voto | GET | `/voto/por-hora` | Retorna votos agrupados por hora |
| Voto | GET | `/voto/total-geral` | Retorna o total geral de votos |

---

## 🧾 5. Logs e Monitoramento

O backend possui logs configurados no `ParticipanteService` e nas demais classes de serviço.  
Esses logs permitem rastrear requisições e identificar facilmente fluxos de entrada e saída no sistema.

Os logs aparecem no console quando a aplicação é executada, e incluem mensagens como:

```
[INFO] PARTICIPANTE SERVICE: [INFO] Consulta realizada com sucesso

```

---

## 🧰 6. Comandos Úteis

### Parar os containers

```bash
docker-compose down
```

### Reconstruir containers

```bash
docker-compose up --build
```

### Ver logs da aplicação

```bash
docker logs -f sboot-user
```

---

## 💡 Dicas de Desenvolvimento

- Sempre certifique-se de que o backend está rodando **antes** do frontend.
- Caso altere o nome ou porta dos containers, atualize o valor da variável `API_BASE_URL` no frontend.
- Para limpar o banco, basta parar os containers e remover o volume Docker:

```bash
docker-compose down -v
```
