export interface QuestionTypeArgs {
	question: Document;
	path: string;
	onEnded?: () => void;
}
