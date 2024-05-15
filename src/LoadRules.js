const fs = require('fs');
const Rule = require('./Rule');

class LoadRules {
    constructor(jsonFile) {
        this.jsonFile = jsonFile;
    }

    readRulesFromJson() {
        const rules = [];

        const data = JSON.parse(fs.readFileSync(this.jsonFile, 'utf8'));
        const states = data.states;

        states.forEach(state => {
            const expressions = state.expressions;

            expressions.forEach(expression => {
                const regularExpression = expression.regular_expression;
                const processing = expression.processing;
                const tokenId = expression.token_id;
                const targetState = expression.target_state;
                const isVar = expression.is_var;
                const vars = expression.vars;
                const identifiedVariables = expression.identified_variables;

                if (regularExpression !== null && processing !== null) {
                    // Correção no nome do estado
                    const rule = new Rule(
                        state.name, // Utiliza state.name para o primeiro estado
                        regularExpression,
                        processing,
                        tokenId,
                        targetState, // Mantém targetState, pois pode ser undefined
                        isVar,
                        vars,
                        identifiedVariables
                    );

                    rules.push(rule);
                }
            });
        });

        return rules;
    }
}

module.exports = LoadRules;
