const vscode = require('vscode');
const LoadRules = require('./src/LoadRules');
const Analyzer = require('./src/Analyzer');

function activate(context) {
    //console.log('Congratulations, your extension "sentry" is now active!');

    let dangerDecorationType; // Definido fora da função para que possa ser acessado globalmente
    
    // Função para imprimir os tokens do arquivo atual
    async function scan() {
        const editor = vscode.window.activeTextEditor;
        
        if (!editor) {
            //vscode.window.showWarningMessage('No file open to print tokens!');
            return;
        }

        const document = editor.document;
        const fileContent = document.getText();

        // Carrega as regras do arquivo JSON
        const jsonFile = '/home/caubi/Documents/teste_plugin/sentry/src/assets/Rules.json'; // Substitua com o caminho do seu arquivo JSON
        const loadRules = new LoadRules(jsonFile);
        const rules = loadRules.readRulesFromJson();
        
        // Inicia o analisador para o conteúdo do arquivo
        const analyzer = new Analyzer(rules);
        analyzer.analyzeFile(fileContent);

        // Obtém o vetor de tokens
        const tokens = analyzer.getTokens();

        // Cria um array para armazenar as decorações
        const decorations = [];

        // Itera sobre os tokens para criar os ranges de decoração
        tokens.forEach(token => {
            const line = token.getLine();
            if (line) {
                const range = document.lineAt(line - 1).range;
                decorations.push({
                    range: range,
                    renderOptions: {
                        after: {
                            contentText: "⚠️", // Ícone de perigo
                            margin: '0px 0px 0px 10px', // Margem para posicionar o ícone
                            color: '#FF0000', // Cor vermelha
                            fontSize: '200%', // Tamanho do ícone
                        }
                    },
                    hoverMessage: `${token.getTokenId()}: ${token.getValue()}`
                });
            }
        });

        // Aplica as decorações ao editor de texto
        editor.setDecorations(dangerDecorationType, decorations);

        //vscode.window.showInformationMessage('Tokens highlighted!');
    }

    // Registro do comando 'sentry.helloWorld'
    //let disposable = vscode.commands.registerCommand('sentry.helloWorld', scan);
    //context.subscriptions.push(disposable);
    
    // Registro do evento para quando o editor de texto ativo mudar
    vscode.window.onDidChangeActiveTextEditor(scan);

    // Registro do evento para quando o texto do documento mudar
    vscode.workspace.onDidChangeTextDocument(event => {
        if (vscode.window.activeTextEditor && event.document === vscode.window.activeTextEditor.document) {
            // Executa novamente o analisador e atualiza as marcações de token
            scan();
        }
    });

    // Definindo o estilo de destaque
    dangerDecorationType = vscode.window.createTextEditorDecorationType({});
    scan();
    // Adicionando o estilo de destaque ao contexto para que seja limpo quando a extensão for desativada
    context.subscriptions.push(dangerDecorationType);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};
