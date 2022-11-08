import React from 'react'

export const ListOfTopics = ({ topics = [], noTopicsText = 'Empty List' }) => {
  if (topics.length === 0) return <p>{noTopicsText}</p>
  return (
    <ol>
      {topics.map((topic) => {
        return (
          <li
            id={topic._id}
            key={topic._id}
            title={topic.fullTitle}
          >
            {topic.title}
          </li>
        )
      })}
    </ol>
  )
}
