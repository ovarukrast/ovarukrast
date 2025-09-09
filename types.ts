export enum ActivityType {
    SerVsEstar = 'ser-vs-estar',
    FillInTheBlank = 'fill-in-the-blank',
    VocabularyMatch = 'vocabulary-match',
    ReadingComprehension = 'reading-comprehension',
    VerbTenses = 'verb-tenses',
    VerbConjugation = 'verb-conjugation',
}

export interface SerVsEstarQuestion {
    sentence: string; // e.g., "Yo ___ de España." with ___
    options: string[]; // e.g., ["soy", "estoy", "eres"]
    correctAnswer: string; // e.g., "soy"
    explanation: string;
}

export interface SerVsEstarExercise {
    type: ActivityType.SerVsEstar;
    title: string;
    questions: SerVsEstarQuestion[];
}

export interface FillInTheBlankQuestion {
    sentence: string; // e.g., "El perro ___ en el jardín."
    correctAnswer: string;
    options?: string[]; // Optional for multiple choice fill-in-the-blank
    hintInGreek?: string;
}

export interface FillInTheBlankExercise {
    type: ActivityType.FillInTheBlank;
    title: string;
    instructions: string;
    questions: FillInTheBlankQuestion[];
}

export interface VocabularyMatchItem {
    word: string;
    definition: string;
}

export interface VocabularyMatchExercise {
    type: ActivityType.VocabularyMatch;
    title: string;
    instructions: string;
    items: VocabularyMatchItem[];
}

export interface ReadingComprehensionQuestion {
    question: string;
    options: string[];
    correctAnswer: string; // The correct option string
}

export interface ReadingComprehensionExercise {
    type: ActivityType.ReadingComprehension;
    title: string;
    text: string;
    questions: ReadingComprehensionQuestion[];
}

export interface VerbTensesQuestion {
    sentence: string; // "Ayer, yo (hablar) ___ con mi amigo."
    verb: string; // "hablar"
    greekVerb: string;
    tense: string; // "pretérito indefinido"
    correctAnswer: string; // "hablé"
}

export interface VerbTensesExercise {
    type: ActivityType.VerbTenses;
    title: string;
    instructions: string;
    questions: VerbTensesQuestion[];
}

export interface VerbConjugationQuestion {
    sentence: string;
    verb: string;
    greekVerb: string;
    tense: string;
    correctAnswer: string;
}

export interface VerbConjugationExercise {
    type: ActivityType.VerbConjugation;
    title: string;
    instructions: string;
    questions: VerbConjugationQuestion[];
}


export type Activity =
    | SerVsEstarExercise
    | FillInTheBlankExercise
    | VocabularyMatchExercise
    | ReadingComprehensionExercise
    | VerbTensesExercise
    | VerbConjugationExercise;

export interface UserAnswer {
    questionIndex: number;
    answer: string;
    isCorrect: boolean;
}