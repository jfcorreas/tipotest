import React from 'react'

export const ListOfTopics = ({ topics = [], noTopicsText = 'Empty List' }) => {
  return (
    <>

      {topics.length > 0
        ? (
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
        : noTopicsText}

    </>
  )
}
