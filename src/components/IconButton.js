import { useRef, useState } from "react"

export default function IconButton({ children, text, color, ...props }) {
  const [hovered, setHovered] = useState(false)
  const ref = useRef(null)

  const buttonStyle = {
    display: "flex",
    padding: "0.5rem", // equivalent to p-2
    alignItems: "center",
    borderRadius: "0.5rem", // equivalent to rounded-lg
    color: "white",
    backgroundColor: color || "black",
    cursor: "pointer",
    border: "none",
    outline: "none"
  }

  const textDivStyle = {
    overflowX: "hidden",
    transition: "all 0.3s ease-out",
    width: hovered ? ref.current?.offsetWidth || 0 : 0,
  }

  const textStyle = {
    paddingLeft: "0.375rem", // equivalent to px-1.5
    paddingRight: "0.375rem",
  }

  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={buttonStyle}
      {...props}
    >
      {children}
      <div style={textDivStyle}>
        <span ref={ref} style={textStyle}>{text}</span>
      </div>
    </button>
  )
}
