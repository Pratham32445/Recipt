import { LangCnt } from "../types";

export const Month = [
  "JANUARY",
  "FEBRUARY",
  "MARCH",
  "APRIL",
  "MAY",
  "JUNE",
  "JULY",
  "AUGUST",
  "SEPTEMBER",
  "OCTOBER",
  "NOVEMBER",
  "DECEMBER",
];

export const Day = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

const techFounders = [
  "Mark Zuckerberg",
  "Steve Jobs",
  "Bill Gates",
  "Jeff Bezos",
  "Larry Page",
  "Elon Musk",
  "Jack Ma",
  "Larry Ellison",
  "Reed Hastings",
  "Jack Dorsey",
];

const VITE_GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

export const aggregateRepos = async (username: string) => {
  let starsCount = 0;
  let forksCount = 0;
  let languages: LangCnt = {};
  let commitCount = 0;
  const rawData = await fetch(
    `https://api.github.com/users/${username}/repos`,
    {
      headers: {
        Authorization: `token ${VITE_GITHUB_TOKEN}`,
      },
    }
  );
  const res = await rawData.json();
  const servedBy = randomServedPerson();
  const toAll = res.map(async (repo: any) => {
    const cnt = await getCommitCount(username, repo.name);
    commitCount += cnt;
    starsCount += repo.stargazers_count;
    forksCount += repo.forks_count;
    const repoLang = repo.language;
    if (repoLang) {
      if (languages[repoLang]) {
        languages[repoLang]++;
      } else languages[repoLang] = 1;
    }
  });
  await Promise.all(toAll);
  const { firstLanguage, secondLanguage } = topLanguages(languages);
  return {
    starsCount,
    forksCount,
    firstLanguage,
    secondLanguage,
    commitCount,
    servedBy,
  };
};

const getCommitCount = async (owner: string, repo: string) => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const rawData = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/commits?since=${thirtyDaysAgo.toISOString()}`,
    {
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `token ${VITE_GITHUB_TOKEN}`,
      },
    }
  );
  const res = await rawData.json();
  if (Array.isArray(res)) return res.length;
  return 0;
};

const topLanguages = (Languages: LangCnt) => {
  let firstMax: number = -1;
  let secondMax: number = -1;
  let firstLanguage: string = "NONE";
  let secondLanguage: string = "NONE";

  // Iterate through the object
  Object.entries(Languages).forEach(([key, value]) => {
    if (value > firstMax) {
      secondMax = firstMax;
      secondLanguage = firstLanguage;
      firstMax = value;
      firstLanguage = key;
    } else if (value > secondMax && value <= firstMax) {
      secondMax = value;
      secondLanguage = key;
    }
  });
  return { firstLanguage, secondLanguage };
};

const randomServedPerson = () => {
  return techFounders[Math.floor(Math.random() * 9)];
};

export const randomId = () => {
  return Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
};

export const prInformation = [
  {
    title: "REPOSITORIES",
    count: 0,
  },
  {
    title: "STARS EARNED",
    count: 0,
  },
  {
    title: "REPO FORKS",
    count: 0,
  },
  {
    title: "FOLLOWERS",
    count: 0,
  },
  {
    title: "FOLLOWING",
    count: 0,
  },
];
