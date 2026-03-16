import { Target, Lightbulb } from "lucide-react";

const QuestionCard = ({ index, question, intention, answer }) => {
    return (
        <article className="qa-card">
            <div className="qa-card__header">
                <div className="qa-card__badge">Q{index + 1}</div>
                <h3>{question}</h3>
            </div>

            <div className="qa-card__body">
                <div className="qa-card__section">
                    <div className="qa-card__label qa-card__label--intent">
                        <Target size={14} /> <span>Why they're asking</span>
                    </div>
                    <p>{intention}</p>
                </div>

                <div className="qa-card__section qa-card__section--answer">
                    <div className="qa-card__label qa-card__label--answer">
                        <Lightbulb size={14} /> <span>How to answer</span>
                    </div>
                    <p>{answer}</p>
                </div>
            </div>
        </article>
    );
};

export default QuestionCard;
