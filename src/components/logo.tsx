import { cn } from "@/lib/utils";

export function Logo({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("text-primary", className)}
      {...props}
    >
      <path d="M 10 9 L 8 9" stroke="#1982c4" />
      <path d="M 14 2 L 14 7" stroke="#4267AC" />
      <path d="M 14 7 A1 1 0 0 0 15 8" stroke="#6a4c93" />
      <path d="M 15 8 L 20 8" stroke="#B55379" />
      <path d="M 16 13 L 8 13" stroke="#FF595E" />
      <path d="M 16 17 L 8 17" stroke="#FF7655" />
      <path d="M 6 22 A2 2 0 0 1 4 20" stroke="#ff924c" />
      <path d="M 4 20 L 4 4" stroke="#FFAE43" />
      <path d="M 4 4 A2 2 0 0 1 6 2" stroke="#ffca3a" />
      <path d="M 6 2 L 14 2" stroke="#C5CA30" />
      <path d="M 14 2 A2.4 2.4 0 0 1 15.704 2.706" stroke="#8ac926" />
      <path d="M 15.704 2.706 L 19.292 6.294" stroke="#52A675" />
      <path d="M 19.292 6.294 A2.4 2.4 0 0 1 20 8" stroke="#1982c4" />
      <path d="M 20 8 L 20 20" stroke="#4267AC" />
      <path d="M 20 20 A2 2 0 0 1 18 22" stroke="#6a4c93" />
      <path d="M 18 22 L 6 22" stroke="#B55379" />
    </svg>
  );
}
