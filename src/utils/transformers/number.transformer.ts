import { Transform } from 'class-transformer';

export function ToNumber(defaultValue: number) {
  return Transform(({ value }) => {
    const parsed = Number(value);
    return !isNaN(parsed) ? parsed : defaultValue;
  });
}
