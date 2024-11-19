const LANG = 'jp';
const axios = require('axios');
require('dotenv').config({ path: './.env.production' });
const BASE_URL = process.env.BASE_URL;

async function getArticlesSlugs() {
  if (process.env.NEXT_PUBLIC_STAGGING=="true")  return [];
  try {
    const response = await axios.get(
      `${BASE_URL}entries/getAllEntryIds/article/${LANG}`
    );
    const entryIds = await response.data;
   let sorted=SortTheEntriesWithDate(entryIds)
   
    const paths = sorted.map((item) => {
      let modDate = formatDate(Number(item?.modification_date));
      return {
        slug: item.key.toString(),
        modDate: modDate,
      };
    });
  
    return paths?.length > 0 ? paths : [];
  } catch (error) {
    return [];
  }
}
async function getCategoriesSlugs() {
  if (process.env.NEXT_PUBLIC_STAGGING=="true")  return [];
  try {
    const response = await axios.get(
      `${BASE_URL}entries/getCategoriesIds/${LANG}`
    );
    const entryIds = await response.data;
   let sorted=SortTheEntriesWithDate(entryIds)
   
    const paths = sorted.map((item) => {
      let modDate = formatDate(Number(item?.modification_date));
      return {
        slug: item.key.toString(),
        modDate: modDate,
      };
    });
  
    return paths?.length > 0 ? paths : [];
  } catch (error) {
    return [];
  }
}
async function getPodcastsSlugs() {
  if (process.env.NEXT_PUBLIC_STAGGING=="true")  return [];
  try {
    const response = await axios.get(
      `${BASE_URL}entries/getAllEntryIds/podcast/${LANG}`
    );
    const entryIds = await response.data;
    let sorted=SortTheEntriesWithDate(entryIds)
    const paths = sorted.map((item) => {
      let modDate = formatDate(Number(item?.modification_date));
      return {
        slug: item.key.toString(),
        modDate: modDate,
      };
    });
    return paths?.length > 0 ? paths : [];
  } catch (error) {
    return [];
  }
}
async function getDirectoriesSlugs() {
  if (process.env.NEXT_PUBLIC_STAGGING=="true")  return [];
  try {
    const response = await axios.get(
      `${BASE_URL}entries/getAllDirectoriesIds/${LANG}`
    );
    const entryIds = await response.data;
    let sorted=SortTheEntriesWithDate(entryIds)
    const paths = sorted.map((item) => {
      let modDate = formatDate(Number(item?.modification_date));
      return {
        slug: item.key.toString(),
        modDate: modDate,
      };
    });
    return paths?.length > 0 ? paths : [];
  } catch (error) {
    return [];
  }
}
async function getEventsSlugs() {
  if (process.env.NEXT_PUBLIC_STAGGING=="true")  return [];
  try {
    const response = await axios.get(
      `${BASE_URL}entries/getAllEventsIds/${LANG}`
    );
    const entryIds = await response.data;
    let sorted=SortTheEntriesWithDate(entryIds)
    const paths = sorted.map((item) => {
      let modDate = formatDate(Number(item?.modification_date));
      return {
        slug: item.key.toString(),
        modDate: modDate,
      };
    });
    return paths?.length > 0 ? paths : [];
  } catch (error) {
    return [];
  }
}
      /**
 
function formatDate to formate the date exp: 2024-04-17 14:12:02 UTC
  
@param date in milliseconds
@returns formate the date exp  2024-04-17 14:12:02 UTC
*/
function formatDate(milliseconds) {
  const date = new Date(milliseconds);

  // Extract the components of the date
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  
  // Construct the formatted date string
  const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}+00:00`;
  
  
  return formattedDate;
  
  }
  /**
   * 
   * @param {*} entryIds 
   * @returns asending sorting of array with date
   */
let SortTheEntriesWithDate=(entryIds)=>{
  let newArray=entryIds?.sort((a, b) =>{
    let moddateA= Number(a?.modification_date);
    let moddateB= Number(b?.modification_date);
    
    return  moddateB-moddateA ;
   });
   return newArray;
}
module.exports = {
  getArticlesSlugs,
  getPodcastsSlugs,
  getDirectoriesSlugs,
  getEventsSlugs,
  getCategoriesSlugs
};
