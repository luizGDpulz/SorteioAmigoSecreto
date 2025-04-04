# 🎁 Sistema de Sorteio de Amigo Secreto

Um sistema web para realizar sorteios de amigo secreto com interface moderna e recursos avançados.

## 📋 Funcionalidades

- Cadastro de participantes com nome e email
- Definição de restrições (quem não pode tirar quem)
- Sorteio automático respeitando as restrições
- Interface individual para cada participante ver seu amigo secreto
- Sistema de reset completo
- Design responsivo e animações
- Tema festivo

## 🚀 Tecnologias Utilizadas

- Python 3.8+
- Flask
- Bootstrap 5
- Font Awesome
- JavaScript (Vanilla)
- CSS3 com animações

## 📁 Estrutura do Projeto
```bash
amigo-secreto/
├── static/
│ ├── css/
│ │ └── style.css # Estilos e animações
│ └── js/
│ └── main.js # Lógica frontend
├── templates/
│ ├── base.html # Template base
│ ├── index.html # Página principal
│ └── sorteio_individual.html # Página individual
└── app.py # Backend Flask
```

## 💻 Instalação e Execução

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/amigo-secreto.git
cd amigo-secreto
```

2. Crie e ative um ambiente virtual:
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows
```

3. Instale as dependências:
```bash
pip install flask
```

4. Execute a aplicação:
```bash
python app.py
```

5. Acesse no navegador:
```
http://localhost:5000
```

## 🎯 Como Usar

### 1. Adicionar Participantes
- Acesse a página inicial
- Preencha o nome e email (opcional)
- Clique em "Adicionar"

### 2. Definir Restrições
- Selecione dois participantes nos dropdowns
- Clique em "Adicionar Restrição"
- Repita conforme necessário

### 3. Realizar Sorteio
- Clique em "Realizar Sorteio"
- O sistema fará o sorteio respeitando as restrições
- Os resultados podem ser visualizados pelo administrador

### 4. Compartilhar Links Individuais
- Na tabela de participantes, clique no ícone de link
- Copie e envie o link individual para cada participante
- Cada participante só verá seu próprio amigo secreto

### 5. Reset do Sistema
- Use o botão "Resetar Tudo" para limpar todos os dados
- Confirme a ação no modal
- O sistema voltará ao estado inicial

## 📱 Endpoints da API

- `GET /` - Página principal
- `GET /participante/<id>` - Página individual do sorteio
- `POST /api/participante` - Adiciona novo participante
- `POST /api/restricao` - Adiciona nova restrição
- `POST /api/sorteio` - Realiza o sorteio
- `POST /api/reset` - Reseta o sistema
- `GET /api/participantes` - Lista todos participantes

## 🔒 Segurança

- Cada participante só pode ver seu próprio amigo secreto
- Links individuais são únicos
- Confirmação necessária para ações importantes
- Validações no frontend e backend

## 🎨 Personalização

### Cores e Tema
Edite `static/css/style.css` para personalizar:
- Gradientes e cores
- Animações
- Espaçamentos
- Fontes

### Textos e Mensagens
Edite os templates em `templates/` para personalizar:
- Títulos
- Mensagens
- Instruções
- Confirmações

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## ✨ Agradecimentos

- Font Awesome pelos ícones
- Bootstrap pela framework CSS
- Flask pela simplicidade e eficiência

---
Desenvolvido tornar sorteios de amigo secreto mais divertidos e organizados.
