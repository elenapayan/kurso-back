"use strict";

const OffensiveWordsRepository = require("../repositories/offensiveWords");

class PopulateOW {
    constructor() { }

    async populateOffensiveWords() {
        try {
            const offensiveWords = await OffensiveWordsRepository.getWords();
            if (offensiveWords.length === 0) {
                OffensiveWordsRepository.saveWord({ word: 'Caca', level: 3 });
                OffensiveWordsRepository.saveWord({ word: 'Culo', level: 4 });
                OffensiveWordsRepository.saveWord({ word: 'Pedo', level: 2 });
                OffensiveWordsRepository.saveWord({ word: 'Pis', level: 1 });
                OffensiveWordsRepository.saveWord({ word: 'Teta', level: 5 });
                console.info('Populate offensive words success');
            } else {
                console.log("LengthWords es distinto de 0")
            }
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = new PopulateOW();