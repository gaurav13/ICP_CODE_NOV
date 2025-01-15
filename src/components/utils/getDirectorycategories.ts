import { makeEntryActor } from '@/dfx/service/actor-locator';

let cachedCategories: any[] | null = null; // Cache for categories

export default async function getCategories(identity: string = '') {
  try {
    // Return cached categories if available
    if (cachedCategories) {
      return cachedCategories;
    }

    // Create the entry actor with or without identity
    const entryActor = makeEntryActor({
      agentOptions: identity ? { identity } : undefined, // Use identity if provided
    });

    // Fetch categories from the actor
    const resp = await entryActor.get_list_categories('', 0, Number.MAX_SAFE_INTEGER, false);

    // Cache the response for subsequent calls
    if (resp && resp.entries) {
      cachedCategories = resp.entries;
    } else {
      console.warn('No categories found in the response:', resp);
      cachedCategories = []; // Fallback to empty array
    }

    return cachedCategories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}
