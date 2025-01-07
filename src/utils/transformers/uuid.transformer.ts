import { Transform } from 'class-transformer';
import { isUUID } from 'class-validator';

export function ToUUID(defaultValue?: string) {
  return Transform(({ value }) => {
    return isUUID(value) ? value : defaultValue;
  });
}
