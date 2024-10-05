export default function PhpLogo({ width = 40, height = 40 }) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        width={width}
        height={height}
        viewBox="0 0 256 256"
      >
        <g fill="none" stroke="none" strokeWidth="1">
          <ellipse cx="128" cy="128" rx="128" ry="70" fill="#8993BE"></ellipse>
          <text
            x="50%"
            y="55%"
            dominantBaseline="middle"
            textAnchor="middle"
            fontFamily="Arial, sans-serif"
            fontSize="110"
            fill="white"
          >
            PHP
          </text>
        </g>
      </svg>
    );
  }
  