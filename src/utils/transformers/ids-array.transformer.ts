import { Transform } from 'class-transformer';
import { isUUID } from 'class-validator';

export function ToArrayIds() {
  return Transform(({ value }) => {
    const ids = value.split(',').map((item: string) => item.trim());
    const validIds = ids.filter((id: string) => isUUID(id));
    return validIds;
  });
}
