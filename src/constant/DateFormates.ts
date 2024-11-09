import { LANG } from "@/constant/language";

export const Date_m_d_y_h_m = 'MMMM Do, YYYY, HH:mm';
export const modifiedDateFormate = 'YYYY-MM-DDTHH:mm:ssZ';
export const ADMIN_TIME_FORMATE='hh:mm A';
export const ADMIN_DATE_FORMATE='DD-MM-yyyy';


export function getIdFromLink(link: string) {
  if (link) {
    const array = link.split('/');
    let id = Number(array[array.length - 1]);
    return id;
  }
}
export function getIdFromUrl(url: string): string | undefined {
  const regex = /image\/(.+\..+)$/;  // Regular expression to match 'getimage/' followed by any characters and '.jpg' at the end
  const match = url?.match(regex); // Apply the regular expression to the url

  if (match) {
    return match[1]; // If a match was found, return the filename
  } else {
  }
}
export function dateTranslate(str: string, t: any) {
  // Example string


  // Regular expression to match numbers
  const numberRegex = /\d+/;

  // Extract the number from the string
  const match = str.match(numberRegex);

  // Check if a number is found and log it
  if (match) {
    const number = parseInt(match[0]);
    const parts = str.split(`${number}`)[1].toString().trim();
    let trans = t(parts)
    // console.log({parts,trans}, "fsadfsafdsfsadf");
    return number + trans;
  } else {
    return t(str);
  }

}