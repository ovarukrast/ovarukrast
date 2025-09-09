// FIX: Define types for different exercise structures
export interface FillBlankQuestion {
    sentence_start: string;
    sentence_end: string;
    correct_answer: string;
    hint: string;
}

export interface SerEstarQuestion {
    sentence: string;
    options: ('ser' | 'estar')[];
    correct_option: 'ser' | 'estar';
    correct_conjugation: string;
    explanation: string;
}

export interface VocabularyPair {
    spanish_word: string;
    greek_translation: string;
}

export interface ReadingComprehensionQuestion {
    question: string;
    options: string[];
    correct_answer: string;
}

export interface ReadingComprehensionContent {
    text: string;
    questions: ReadingComprehensionQuestion[];
}

export interface VerbTenseQuestion {
    sentence_start: string;
    verb: string;
    sentence_end: string;
    tense: string;
    options: string[];
    correct_answer: string;
    explanation: string;
}
