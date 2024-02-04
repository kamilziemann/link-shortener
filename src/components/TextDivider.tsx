import { FC } from 'react';

interface Props {
  text: string;
}

const TextDivider: FC<Props> = ({ text }) => (
  <div className="relative">
    <div className="absolute inset-0 flex items-center">
      <span className="w-full border-t" />
    </div>
    <div className="relative flex justify-center text-xs uppercase">
      <span className="bg-background px-2 text-muted-foreground">{text}</span>
    </div>
  </div>
);

export default TextDivider;