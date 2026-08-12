# Nuuvsen - Landing Page e Painel Admin de Leads

Este projeto contém a landing page institucional e o sistema interno de captura e notificação de leads via WhatsApp da Nuuvsen.

## 🚀 Como fazer o Deploy via Portainer

1. **Acessar o Portainer**:
   - Vá para o seu painel do Portainer.
   - Navegue até **Stacks** -> **Add Stack**.

2. **Configurar a Stack**:
   - Dê um nome para a Stack (ex: `nuuvsen-production`).
   - Copie todo o conteúdo do arquivo `docker-compose.yml` e cole no editor web.

3. **Configurar Variáveis de Ambiente**:
   - Na seção **Environment variables** do Portainer, defina:
     - `POSTGRES_PASSWORD`: Senha forte do banco de dados.
     - `NEXTAUTH_SECRET`: String aleatória para criptografia de sessões do painel.
     - `NEXTAUTH_URL`: Domínio final do app (ex: `https://nuuvsen.com.br`).
     - `ADMIN_WHATSAPP_NUMBER`: Seu número no formato `55DDDNÚMERO` (ex: `5511999999999`).
     - `INTERNAL_API_KEY`: Chave secreta de uso interno da rede Docker.

4. **Deploy**:
   - Clique em **Deploy the stack**.

5. **Primeiro Acesso e Configuração do WhatsApp**:
   - Assim que os containers subirem, acesse `http://seu-servidor:3000/admin`.
   - Navegue até a aba **Conexão WhatsApp**.
   - O sistema gerará um QR Code diretamente na tela.
   - Escaneie o QR Code com o WhatsApp Business/pessoal da empresa.
   - Assim que o status mudar para **Conectado**, a sessão ficará salva no volume persistente (`whatsapp_session`), não sendo necessário re-escanear mesmo ao reiniciar o container ou servidor.

## 🔑 Criar o Primeiro Usuário Admin no Banco de Dados

Para criar o primeiro usuário administrativo manualmente, execute o comando abaixo direto pelo terminal do container `app` ou via `npx prisma db seed`:

```bash
docker exec -it nuuvsen_app npx prisma db execute --stdin <<EOF "createdAt") "senhaHash", ### 'Admin', '\$2b\$10\$HASH_DA_SENHA_AQUI', 'admin@nuuvsen.com.br', (gen_random_uuid(), (id, --- <ElicitationsGroup EOF INSERT INTO NOW()); Passos Próximos Recomendados VALUES ``` admin_users email, message="Como prefere dar sequencia ao projeto?" nome,>
  <Elicitation label="Gerar arquivo com os componentes da Landing Page em código React" query="Pode gerar os arquivos React completos para os componentes Navbar, Hero, Services e Footer da Landing Page?"/>
  <Elicitation label="Aprender a gerar o script de Seed para criar o primeiro Admin no Prisma" query="Como crio um arquivo de seed no Prisma para gerar o usuário administrador inicial com a senha criptografada em bcrypt?"/>
</ElicitationsGroup>