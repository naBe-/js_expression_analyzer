function lexer(expression) {
    if(expression === undefined)
        return undefined;
    this.expression = expression;
    this.index = 0;

    console.log("lexer created with exoression " + expression);

    this.isWhiteSpace = function(ch) {
        return (ch === 'u0009') || (ch === ' ') || (ch === 'u00A0');
    };

    this.isLetter = function(ch) {
        return (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z');
    };

    this.isDecimalDigit = function(ch) {
        return (ch >= '0') && (ch <= '9');
    };

    this.createToken = function(type, value) {
        return {
            type: type,
            value: value
        };
    };

    this.getNextChar = function() {
        var ch = 'x00',
            idx = this.index;
        if (idx < this.expression.length) {
            ch = this.expression.charAt(idx);
            this.index += 1;
        }
        return ch;
    };

    this.peekNextChar = function() {
        var idx = this.index;
        return ((idx < this.expression.length) ? this.expression.charAt(idx) : 'x00');
    };
    
    this.skipSpaces = function() {
        var ch;

        while(this.index < this.expression.length) {
            ch = this.peekNextChar();
            if(!this.isWhiteSpace(ch))
                break;
            this.getNextChar();
        }
    };

    this.scanOperator = function() {
        var op = this.peekNextChar();
        if('+-/*'.indexOf(op) >= 0) {
            return this.createToken('Operator', this.getNextChar());
        }
        return undefined;
    };

    this.isIdentifierStart = function(ch) {
        return (ch === '_') || this.isLetter(ch);
    };

    this.isIdentifierPart = function(ch) {
        return this.isIdentifierStart(ch) || this.isDecimalDigit(ch);
    };

    this.scanIdentifier = function() {
        var ch, id;

        ch = this.peekNextChar();
        if(!this.isIdentifierStart(ch))
            return undefined;

        id = this.getNextChar();
        while(true) {
            ch = this.peekNextChar();
            if(!this.isIdentifierPart(ch))
                break;
            id += this.getNextChar();
        }

        return this.createToken('Identifier', id);
    };

    this.scanNumber = function() {
        var ch,
            number = '';

        ch = this.peekNextChar();
        if((!this.isDecimalDigit(ch)) && (ch !== '.'))
            return undefined;

        if(ch !== '.') {
            number = this.getNextChar();
            while(true) {
                ch = this.peekNextChar();
                if(!this.isDecimalDigit(ch))
                    break;
                number += this.getNextChar();
            }
        }

        if(ch === '.') {
            number += this.getNextChar();
            while(true) {
                ch = this.peekNextChar();
                if(!this.isDecimalDigit(ch))
                    break;
                number += this.getNextChar();
            }
        }

        if(ch === 'e' || ch === 'E') {
            number += this.getNextChar();
            ch = this.peekNextChar();
            if(ch === '+' || ch ==='-' || this.isDecimalDigit(ch)) {
                number += this.getNextChar();
                while(true) {
                    ch = this.peekNextChar();
                    if(!this.isDecimalDigit(ch))
                        break;
                    number += this.getNextChar();
                }
            } else {
                throw new SyntaxError("Unexpected character after the exponent sign.");
            }
        }

        return this.createToken('Number', number);
    };

    this.next = function() {
        var token;

        this.skipSpaces();
        if(this.index >= this.expression.length)
            return undefined;

        token = this.scanNumber();
        if(typeof token !== 'undefined')
            return token;

        token = this.scanOperator();
        if(typeof token !== 'undefined')
            return token;

        token = this.scanIdentifier();
        if(typeof token !== 'undefined')
            return token;

        throw new SyntaxError("Unknown token from character '" + this.peekNextChar() + "' at position " + this.index);
    };
}

module.exports = {
    lexer: lexer
}
