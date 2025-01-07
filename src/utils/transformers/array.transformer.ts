import { Transform } from 'class-transformer';

export function ToArray() {
  return Transform(({ value }) => {
    const values = value.split(',').map((item: string) => item.trim());
    return values;
  });
}
