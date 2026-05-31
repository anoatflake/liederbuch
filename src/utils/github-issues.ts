//import { Octokit } from "@octokit/core";

export const ISSUE_TYPE = {
  BUG: "BUG",
  FEATURE: "FEATURE",
  NEW_SONG: "NEW_SONG",
} as const;

type IssueType = keyof typeof ISSUE_TYPE;

/*
--> rest request on server --> openapi trpc

export async function createIssue(
  issueType: IssueType,
  title: string,
  description: string,
  linkToScreenshot?: string
) {
  const octokit = new Octokit({
    auth: env.GITHUB_LIEDERBUCH_TOKEN,
  });

  await octokit.request("POST /repos/{owner}/{repo}/issues", {
    owner: env.GITHUB_OWNER,
    repo: env.GITHUB_LIEDERBUCH_REPO,
    title: createBasicTitle(issueType, title),
    body:
      createBasicDescription(issueType, description) +
      createScreenshot(linkToScreenshot),
    assignees: [env.GITHUB_OWNER],
    labels: [issueType],
  });
}
*/

/**
 * creates title for the github issue
 * @param issueType
 * @param title
 * @returns string
 */
export function createBasicTitle(issueType: IssueType, title: string): string {
  switch (issueType) {
    case ISSUE_TYPE.BUG:
      return "bug: " + title;
    case ISSUE_TYPE.FEATURE:
      return "feat: " + title;
    case ISSUE_TYPE.NEW_SONG:
      return "new song:" + title;
    default:
      return title;
  }
}

/**
 * creates simple issue description in markdown
 * @param issueType
 * @param description
 * @returns string
 */
export function createBasicDescription(
  issueType: IssueType,
  description: string,
): string {
  let descriptionString = "";
  switch (issueType) {
    case ISSUE_TYPE.BUG:
      descriptionString += "### Bugreport: \n" + description;
      break;
    case ISSUE_TYPE.FEATURE:
      descriptionString += "### Feature description: \n" + description;
      break;
    case ISSUE_TYPE.NEW_SONG:
      descriptionString += "### Link to chords: \n[" + description + "](url)";
      break;
  }
  return descriptionString;
}

/**
 * creates the screenshot description for bug issues
 * @param linkToScreenshot
 * @returns string
 */
export function createScreenshot(linkToScreenshot?: string): string {
  let screenshotDescription = "### Screenshot: \n";
  if (linkToScreenshot) {
    screenshotDescription += "![link to screenshot](" + linkToScreenshot + ")";
  } else {
    screenshotDescription += "No screenshot provided.";
  }
  return screenshotDescription;
}

/**
 * creates the browser info description for bug issues
 * @param browserInfo
 * @returns string
 */
export function createBrowserInfo(browserInfo?: string): string {
  let additionalInfoDescribition = "### Browser/OS: \n";
  if (browserInfo) {
    additionalInfoDescribition += browserInfo;
  } else {
    additionalInfoDescribition += "No browser/OS information provided.";
  }
  return additionalInfoDescribition;
}
