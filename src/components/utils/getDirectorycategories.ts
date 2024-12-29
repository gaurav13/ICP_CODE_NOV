import { makeEntryActor } from '@/dfx/service/actor-locator';

export default async function getCategories(identity: string) {
  const entryActor = makeEntryActor({
    agentOptions: {
      identity,
    },
  });
  const resp = await entryActor.get_list_categories('', 0, Number.MAX_SAFE_INTEGER, false);
  return resp.entries;
}
