export default function RLogo({ width = 40, height = 40 }) {
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
          <path
            d="M128,0 C198.6,0 256,57.4 256,128 C256,198.6 198.6,256 128,256 C57.4,256 0,198.6 0,128 C0,57.4 57.4,0 128,0 Z"
            fill="#276DC3"
          ></path>
          <g transform="translate(50, 90)">
            <text
              x="0"
              y="60"
              fontSize="100"
              fill="white"
              fontFamily="Arial, sans-serif"
              fontWeight="bold"
            >
              R
            </text>
          </g>
        </g>
      </svg>
    );
  }
  