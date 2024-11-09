import logger from '@/lib/logger';
import { fromNullable } from '@dfinity/utils';

async function getChildren(categories: any, entryActor: any) {
  const result = [];
  for (const category of categories) {
    // const { id, parent } = category[1];

    const childrenIdArrays = fromNullable(category[1]?.children);
    if (!childrenIdArrays) {
      result.push(category);
      logger('DEEEZZZ::: EMPRTYYTUEPREP', category);
      continue;
    }

    const children = await Promise.all(
      await entryActor.child_to_category(childrenIdArrays)
    );

    const childrenWithNested: any = await Promise.all(
      await getChildren(children, entryActor)
    );
    category[1].children = childrenWithNested;
    result.push(category);
  }
  return result;
}
export default getChildren;
