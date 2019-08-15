export default class MaskedTextResultFactory {
    constructor(tokensRegex) {
        this.completenessRegex = tokensRegex.reduce((maskRegex, tokenRegex) => maskRegex + tokenRegex.regex, '');
    }
    create(text) {
        const x = text.match(this.completenessRegex);
        const isComplete = !!x;
        return {
            text,
            complete: isComplete
        };
    }
}
//# sourceMappingURL=maskedTextResultFactory.js.map