const Token = require('./Token');

class Analyzer {
    constructor(rules) {
        this.rules = rules;
        this.currentState = "Global";
        this.lexeme = "";
        this.currentLexeme = "";
        this.tokens = [];
        this.lexemes = [];
        this.currentToken = null;
        this.jumpNotContatenator = 0;
        this.index = 0;
        this.buffer = "";
        this.vars = {};
        this.currentTokens = [];
    }

    analyzeFile(fileContent) {
     
        this.processLexeme("Global", fileContent, 0);
        
    }

    processLexeme(state, fileContent, indice) {
        for (const rule of this.rules) {
            
            
            if (rule.getState() === state) {
                let listVars = [];
                
                if (rule.getIsVar() === "True") {
                    
                    let expression = new RegExp(rule.getRegularExpression(), 'g');
                    let varsExpression = expression.source;
                    listVars = rule.getVars().split(', ');
    
                    for (const i of listVars) {
                        const remove = expression.source.split(i);
                        expression = new RegExp(remove[0] + "\\S+" + remove[1], 'g');
                    }
    
                    let match;
                    indice = 0;
                    while ((match = expression.exec(fileContent.slice(indice))) !== null) {
                        const listofVar = varsExpression.split(/\s+|\\s\*|\.|'|\"|=/).filter(Boolean);
                        const listofMatch = match[0].split(/\s+|\\s\*|\.|'|\"|=/).filter(Boolean);
                        
                        for (const variables of listVars) {
                            this.vars[variables] = listofMatch[listofVar.indexOf(variables)];
                        }
                        
                        const token = new Token(rule.getTokenId(), match[0], this.findLineNumberByStartPosition(fileContent, match.index + indice));
                        this.currentTokens.push(token);
                        
                        indice += match.index + match[0].length;
    
                        if (rule.getProcessing() === "Jump") {
                            
                            this.processLexeme(rule.getTargetState(), fileContent, indice);
                        }
                    }
    
                    this.vars = {};
                    this.currentTokens = [];
                } else if (rule.getIdentifiedVariables() !== null) {
                    const identifiedVariables = rule.getIdentifiedVariables().split(", ");
                    let expression = new RegExp(rule.getRegularExpression(), 'g');
    
                    for (const i of identifiedVariables) {
                        const remove = expression.source.split(i);
                        expression = new RegExp(remove[0] + this.vars[i] + remove[1], 'g');
                        
                    }
                    
                    let match;
                    while ((match = expression.exec(fileContent.slice(indice))) !== null) {
                        const token = new Token(rule.getTokenId(), match[0], this.findLineNumberByStartPosition(fileContent, match.index + indice));
                        this.currentTokens.push(token);
                        
                        if (rule.getProcessing() === "Return_token") {
                  
                            for (const tokens of this.currentTokens) {
                                let count = 0;
    
                                for (const i of this.tokens) {
                                    if (this.tokens.length !== 0) {
                                        if (tokens.getLine() === i.getLine()) {
                                            count += 1;
                                        }
                                    }
                                }
    
                                if (count === 0) {
                                    this.tokens.push(tokens);
                                }
                            }
    
                            return;
                        }
                    }
                } else {
                    let expression = new RegExp(rule.getRegularExpression(), 'g');
                    indice = 0
                    let match;
                    while ((match = expression.exec(fileContent.slice(indice))) !== null) {
                        const token = new Token(rule.getTokenId(), match[0], this.findLineNumberByStartPosition(fileContent, match.index + indice));
    
                        if (rule.getProcessing() === "Return_token") {
                            let count = 0;
    
                            for (const i of this.tokens) {
                                if (this.tokens.length !== 0) {
                                    if (token.getLine() === i.getLine()) {
                                        count += 1;
                                    }
                                }
                            }
    
                            if (count === 0) {
                                this.tokens.push(token);
                            }
                        }
    
                        indice += match.index + match[0].length;
                    }
                }
            }
        }
    }
    

    getTokens() {
        return this.tokens;
    }

    findLineNumberByStartPosition(originalString, startPosition) {
        const lines = originalString.split('\n');
        let currentPosition = 0;

        for (let lineNumber = 1; lineNumber <= lines.length; lineNumber++) {
            if (currentPosition <= startPosition && startPosition < currentPosition + lines[lineNumber - 1].length) {
                return lineNumber;
            }

            currentPosition += lines[lineNumber - 1].length + 1;
        }

        return null;
    }
}

module.exports = Analyzer;
