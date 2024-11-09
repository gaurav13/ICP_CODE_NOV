import logger from "@/lib/logger";

export const getEntriesCount =(ariclescount:any) => {


  if (ariclescount) {
    for (let key in ariclescount) {
      ariclescount[key] = parseInt(ariclescount[key]);
    }
return ariclescount;

  }
}

export const getUsersCount = (userCount:any) =>{
  if (userCount) {
    for (let key in userCount) {
      userCount[key] = parseInt(userCount[key]);
    }
return userCount;
}
}


export const getWeb3Count = (web3Count:any) =>{
  if (web3Count) {
    for (let key in web3Count) {
      web3Count[key] = parseInt(web3Count[key]);
    }
return web3Count;
}
}
export const getEventsCount = (eventsCount:any) =>{
  if (eventsCount) {
    for (let key in eventsCount) {
      eventsCount[key] = parseInt(eventsCount[key]);
    }
return eventsCount;
}
}

export const getQuizCount = (quizCount:any) =>{
  if (quizCount) {
    for (let key in quizCount) {
      quizCount[key] = parseInt(quizCount[key]);
    }
return quizCount;
}
}


export const getSurveyCount = (surveyCount:any) =>{
  if (surveyCount) {
    for (let key in surveyCount) {
      surveyCount[key] = parseInt(surveyCount[key]);
    }
return surveyCount;
}
}

export const getpromtedCount = (promotedCount:any) =>{
  if (promotedCount) {
    for (let key in promotedCount) {
      promotedCount[key] = parseInt(promotedCount[key]);
    }
return promotedCount;
}
}