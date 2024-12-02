from flask import Flask, render_template, request, jsonify
import random

app = Flask(__name__)

class AmigoSecreto:
    def __init__(self):
        self.participantes = []
        self.restricoes = {}
        self.ultimo_sorteio = None
        
    def adicionar_participante(self, nome):
        if nome not in self.participantes:
            self.participantes.append(nome)
            return True
        return False
    
    def adicionar_restricao(self, pessoa1, pessoa2):
        if pessoa1 not in self.restricoes:
            self.restricoes[pessoa1] = []
        self.restricoes[pessoa1].append(pessoa2)
    
    def realizar_sorteio(self):
        if len(self.participantes) < 2:
            return None
            
        sorteio = {}
        disponíveis = self.participantes.copy()
        
        for pessoa in self.participantes:
            possíveis = [p for p in disponíveis if p != pessoa and 
                        (pessoa not in self.restricoes or p not in self.restricoes[pessoa])]
            
            if not possíveis:
                return self.realizar_sorteio()
                
            escolhido = random.choice(possíveis)
            sorteio[pessoa] = escolhido
            disponíveis.remove(escolhido)
            
        self.ultimo_sorteio = sorteio
        return sorteio
    
    def resetar(self):
        self.participantes = []
        self.restricoes = {}
        self.ultimo_sorteio = None
        return True

sorteador = AmigoSecreto()

# Rotas da aplicação
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/participante/<int:id>')
def ver_sorteio_participante(id):
    if id < 0 or id >= len(sorteador.participantes):
        return render_template('sorteio_individual.html', 
                             error='Participante não encontrado')
        
    participante = sorteador.participantes[id]
    nome_participante = participante['nome'] if isinstance(participante, dict) else participante
    
    if not sorteador.ultimo_sorteio:
        return render_template('sorteio_individual.html', 
                             error='Nenhum sorteio realizado ainda')
        
    amigo_secreto = sorteador.ultimo_sorteio.get(nome_participante)
    if not amigo_secreto:
        return render_template('sorteio_individual.html', 
                             error='Sorteio não encontrado para este participante')
        
    return render_template('sorteio_individual.html',
                         participante=nome_participante,
                         amigo_secreto=amigo_secreto)

@app.route('/api/participante', methods=['POST'])
def adicionar_participante():
    data = request.get_json()
    nome = data.get('nome')
    if sorteador.adicionar_participante(nome):
        return jsonify({'message': 'Participante adicionado com sucesso'})
    return jsonify({'error': 'Participante já existe'}), 400

@app.route('/api/restricao', methods=['POST'])
def adicionar_restricao():
    data = request.get_json()
    pessoa1 = data.get('pessoa1')
    pessoa2 = data.get('pessoa2')
    sorteador.adicionar_restricao(pessoa1, pessoa2)
    return jsonify({'message': 'Restrição adicionada com sucesso'})

@app.route('/api/sorteio', methods=['POST'])
def realizar_sorteio():
    resultado = sorteador.realizar_sorteio()
    if resultado:
        return jsonify(resultado)
    return jsonify({'error': 'Não foi possível realizar o sorteio'}), 400

@app.route('/api/participantes', methods=['GET'])
def listar_participantes():
    return jsonify({
        'participantes': sorteador.participantes,
        'restricoes': sorteador.restricoes
    })

@app.route('/api/reset', methods=['POST'])
def resetar_sorteio():
    sorteador.resetar()
    return jsonify({'message': 'Sistema resetado com sucesso'})

if __name__ == '__main__':
    app.run(debug=True) 