export function DoodleBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Base tint */}
      <div className="absolute inset-0 bg-primary/[0.06]" />

      {/* SVG doodle pattern */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.12]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="doodles"
            x="0"
            y="0"
            width="120"
            height="120"
            patternUnits="userSpaceOnUse"
          >
            {/* Star */}
            <path
              d="M20 8l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Heart */}
            <path
              d="M50 22c0-3 2-5 5-5s5 2 5 5c0 4-5 7-5 7s-5-3-5-7z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Circle */}
            <circle
              cx="90"
              cy="18"
              r="5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
            />
            {/* Lightning bolt */}
            <path
              d="M30 55l-4 8h6l-4 8"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Smiley */}
            <circle
              cx="70"
              cy="58"
              r="6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
            />
            <circle cx="68" cy="56" r="1" fill="currentColor" />
            <circle cx="72" cy="56" r="1" fill="currentColor" />
            <path
              d="M67 60c1 2 5 2 6 0"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
            />
            {/* Diamond */}
            <path
              d="M100 50l5 6-5 6-5-6z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Squiggle */}
            <path
              d="M10 85c3-4 6-4 9 0s6 4 9 0"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            {/* Triangle */}
            <path
              d="M55 80l5-8 5 8z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Cross / plus */}
            <path
              d="M88 82v-6M85 79h6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            {/* Dots cluster */}
            <circle cx="30" cy="100" r="1.5" fill="currentColor" />
            <circle cx="35" cy="103" r="1" fill="currentColor" />
            <circle cx="28" cy="105" r="1.2" fill="currentColor" />
            {/* Spiral */}
            <path
              d="M105 95c-2-2-5-2-6 0s-1 5 1 6 5 0 6-2 0-5-2-6-5-1-6 1"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
            />
            {/* Arrow */}
            <path
              d="M48 110l8-4-8-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M40 110h16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            {/* Small star variant */}
            <path
              d="M75 108l1.5 3 3 .5-2.2 2.2.5 3-2.8-1.5-2.8 1.5.5-3-2.2-2.2 3-.5z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Cloud */}
            <path
              d="M15 40c-2 0-4-1-4-3s2-3 4-3c0-3 3-5 6-5 3 0 5 2 5 5 2 0 4 1 4 3s-2 3-4 3"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Music note */}
            <path
              d="M95 110v-10c0-2 3-3 5-2v12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="93" cy="112" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
            {/* Wavy line */}
            <path
              d="M60 5c2 3 4 3 6 0s4-3 6 0"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
            />
            {/* Hexagon-ish */}
            <path
              d="M5 115l4-3 4 3 0 5-4 3-4-3z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#doodles)" className="text-foreground" />
      </svg>
    </div>
  );
}
