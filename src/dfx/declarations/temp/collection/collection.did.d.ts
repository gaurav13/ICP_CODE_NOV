import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface Collection {
  'creation_time' : bigint,
  'name' : string,
  'user' : User,
  'description' : string,
  'image' : ImageObject,
}
export type CollectionId = string;
export type ImageObject = Uint8Array | number[];
export interface InputCollection {
  'name' : string,
  'user' : User,
  'description' : string,
  'image' : ImageObject,
}
export type Key = string;
export type User = string;
export type User__1 = string;
export interface _SERVICE {
  'getAllCollections' : ActorMethod<[], Array<[Key, Collection]>>,
  'getCollection' : ActorMethod<[Key], [] | [Collection]>,
  'getUserCollection' : ActorMethod<[User__1], Array<[Key, Collection]>>,
  'insertCollection' : ActorMethod<[InputCollection], CollectionId>,
}
