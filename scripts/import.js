const { Client } = require('@notionhq/client');
const path = require('path');
const fs = require('fs');

const notion = new Client({ auth: process.env.NOTION_API_TOKEN });
const orgDBID = process.env.NOTION_ORG_DB_ID;
const jobDBID = process.env.NOTION_JOB_DB_ID;

const outputFile = "./data/cms.json";
const slugColumn = "Slug";
const networksColumn = "Networks";
const fieldColumn = "Field";

const orgDB = {
  id: orgDBID,
  columns: {
    name: "Name",
    slug: "Slug",
    networks: "Networks",
    platform: "Platform",
    industries: "Industries",
    shareholderSize: "Shareholder Size",
    homepageURL: "Homepage URL",
    logoURL: "Logo URL",
    jobsURL: "Jobs URL",
    governanceURL: "Governance URL",
    forumURL: "Forum URL",
    discordURL: "Discord URL",
    telegramURL: "Telegram URL",
    twitterURL: "Twitter URL",
    githubURL: "Github URL",
    instagramURL: "Instagram URL",
    docsURL: "Docs URL",
    blogURL: "Blog URL",
    substackURL: "Substack URL",
    youtubeURL: "YouTube URL",
  }
};

const jobDB = {
  id: jobDBID,
  columns: {
    slug: "Slug",
    field: "Field",
    organization: "Organization",
    title: "Job Title",
    location: "Location",
    timeCommitment: "Time Commitment",
    postedDate: "Posted Date",
    closedDate: "Closed Date",
    duration: "Duration",
    experienceLevel: "Experience Level",
    sourceURL: "Source URL",
    summary: "Summary",
  }
};

const formatTitle = (title) => title.replace(/[\W]+/g, "-").toLowerCase();

const processNotionValue = (value) => {
  if (!value) {
    return "";
  }
  if (value.type === "url") {
    return value.url;
  }

  if (value.type === "select") {
    return value.select.name.toLowerCase();
  }

  if (value.type === "multi_select") {
    return value.multi_select.map((s) => s.name );
  }

  if (value.type === "date") {
    return value.date.start;
  }

  if (value.type === "rich_text") {
    return value.rich_text.map((rt) => {
      return rt.text.content;
    }).join(" ");
  }

  if (value.type === "title") {
    if (value.title.length === 0) {
      return "";
    }
    return value.title[0].text.content;
  }

  // TODO:
  if (value.type === "relation") {
    if (value.relation.length === 0) {
      return;
    }
    return value.relation[0].id;
  }

  console.log("Fatal: Unknown value type: " + value.type);
  throw new Error("unknown value type");
};

var networks = new Set();
var fields = new Set();

const loadDB = async (db) => {
  const response = await notion.databases.query({ database_id: db.id });

  // Map all pages to a corresponding object
  return response.results.reduce((acc, result) => {
    const properties = result.properties;
    if(!properties || !properties) {
      console.log(result);
      return
    }

    var obj = {title: formatTitle(properties[slugColumn].title[0].plain_text)};

    // Map all page properties to object properties
    acc[result.id] = Object.keys(db.columns).reduce((obj, localName) =>{
      const remoteName = db.columns[localName];
      obj[localName] = processNotionValue(properties[remoteName]);

      if (remoteName === networksColumn) {
        obj[localName].forEach((n) => networks.add(n));
      } else if (remoteName === fieldColumn) {
        if (obj[localName] !== "") {
          fields.add(obj[localName]);
        }
      }

      return obj;
    }, obj);

    return acc;
  }, {});
};

loadDB(orgDB).then((orgs) => {
  if(!orgs) {
    console.log("Failed to load orgs");
    return;
  }

  loadDB(jobDB).then((jobs) => {
    if(!jobs) {
      console.log("Failed to load jobs");
      return;
    }

    // De-normalize the org objects into the job objects
    Object.keys(jobs).forEach((jobID) => {
      const orgID = jobs[jobID].organization;
      jobs[jobID].organization = {};
      if (!orgID) {
        return;
      }
      jobs[jobID].organization = orgs[orgID];
    });

    fs.writeFileSync(outputFile, JSON.stringify({
      orgs: orgs,
      jobs: jobs,
      networks: Array.from(networks),
      fields: Array.from(fields),
    }));
  });
});
