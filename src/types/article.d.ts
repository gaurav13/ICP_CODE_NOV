



export interface Article {
  title: string;
  // description: string;
  seoTitle: string;
  seoSlug: string;
  seoDescription: string;
  seoExcerpt: string;
}
export interface TopEvent {
  id: string;
  title: string;
  image: string;
  date: string;
  endDate: string;
  shortDescription: string;
  freeTicket : string;
  applyTicket : string;
  lat : Float;
    lng : Float;
  isStatic:boolean;

}
export interface ListEvent {
  id: string;
  title: string;
  image: string;
  date: string;
  shortDescription: string;
  website: string;
  freeTicket : string;
  applyTicket : string;
  isStatic:boolean;
  discountTicket : string;

}
export interface EventStatus {
  all?: null;
  upcoming?: null;
  ongoing?: null;
  past?: null;
}
