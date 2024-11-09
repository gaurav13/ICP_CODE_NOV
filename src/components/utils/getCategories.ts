import { makeEntryActor } from '@/dfx/service/actor-locator';

export default async function getCategories(identity: string) {
  const entryActor = makeEntryActor({
    agentOptions: {
      identity,
    },
  });
  const resp = await entryActor.get_list_categories('', 0, 20, false);
  return resp.entries;
}
