export let sliceString=(text:string,startfrom:number,len:number)=>{
  return text.length > len
    ? text.slice(startfrom, len) + '...'
    : text
}

  /**
   * removeHtml use to remove html tags from html and return text
   * @param html 
   * @returns text
   */
  export function removeHtml(html: string) :string{
    const text = html.replace(/<[^>]*>?/gm, ''); // Remove HTML tags
    const words = text.split(/\s+/); // Split by spaces
    return words.join(" "); // Filter out empty strings and count the rest
  }