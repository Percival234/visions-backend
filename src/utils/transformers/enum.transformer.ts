import { Transform } from 'class-transformer';

export function ValidateEnum(EnumObj: object) {
  return Transform(({ value }) => {
    return Object.values(EnumObj).includes(value) ? value : undefined;
  });
}
