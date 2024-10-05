export default function RubyLogo({ width = 40, height = 40 }) {
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
            fill="#CC342D"
          ></path>
          <polygon
            fill="white"
            points="128,50 164,128 92,128 128,50"
          ></polygon>
        </g>
      </svg>
    );
  }
  