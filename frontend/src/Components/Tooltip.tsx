type TooltipProps = {
  message?: string;
  children: React.ReactNode;
};

export default function Tooltip({ message, children }: TooltipProps) {
  return (
    <div className="flex justify-center">
      <div className="group relative flex">
        {children}
        <span className="absolute -top-2 left-6 scale-0 transition-all rounded bg-light-purple p-2 text-xs text-black group-hover:scale-100">{message}</span>
      </div>
    </div>
  );
}
