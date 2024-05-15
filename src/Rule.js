class Rule {
    constructor(state, regularExpression, processing, tokenId, targetState = null, isVar = null, vars = null, identifiedVariables = null) {
        this.state = state;
        this.regularExpression = regularExpression;
        this.processing = processing;
        this.tokenId = tokenId;
        this.targetState = targetState;
        this.isVar = isVar;
        this.vars = vars;
        this.identifiedVariables = identifiedVariables;
    }

    getState() {
        return this.state;
    }

    getRegularExpression() {
        return this.regularExpression;
    }

    getProcessing() {
        return this.processing;
    }

    getTokenId() {
        return this.tokenId;
    }

    getTargetState() {
        return this.targetState;
    }

    getIsVar() {
        return this.isVar;
    }

    getVars() {
        return this.vars;
    }

    getIdentifiedVariables() {
        return this.identifiedVariables;
    }
}

module.exports = Rule;
