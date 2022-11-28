import React from 'react'

export const ListOfAnswers = ({ question, noAnswersText = '' }) => {
  if (!question) return <p>{noAnswersText}</p>

  return (
    <ul>
      {question.answers?.map((answer) => {
        return (
          <li
            id={answer._id}
            key={answer._id}
            className={answer.isCorrect ? 'trueQuestion' : null}
          >
            {answer.text}
          </li>
        )
      })}
    </ul>
  )
}
