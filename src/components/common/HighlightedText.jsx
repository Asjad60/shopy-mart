import React from 'react'

function HighlightedText({text,customClass}) {
  return (
    <h1 className={`bg-clip-text bg-gradient-to-b text-4xl font-bold from-sky-500 to-sky-200  ${customClass}`}
     style={{WebkitTextFillColor: "transparent",WebkitBackgroundClip:"text"}}
    >
        {text}
    </h1>
  )
}

export default HighlightedText