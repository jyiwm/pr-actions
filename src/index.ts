/* global console */
import * as core from '@actions/core';
import { context, getOctokit } from '@actions/github';

try {
  // `who-to-greet` input defined in action metadata file
  // const nameToGreet = core.getInput('who-to-greet');
  const token = core.getInput('github-token');
  const jiraAccount = core.getInput('jira-account');
  const ticketRegex = new RegExp(core.getInput('ticket-regex') || '[A-Z]+-\\d+');

  const { repo } = context;
  const { pull_request } = context.payload;
  const prNumber = pull_request.number;
  const headBranch = pull_request.head.ref;

  // Create URL for body
  const [ticketId] = headBranch.match(ticketRegex) || ['GOONIES-123'];
  const url = `https://${jiraAccount}.atlassian.net/browse/${ticketId}`;

  // Make request to update PR
  const octokit = getOctokit(token);
  const request: Parameters<typeof octokit.rest.pulls.update>[0] = {
    body: url,
    owner: repo.owner,
    repo: repo.repo,
    pull_number: prNumber,
  }

  const response = await octokit.rest.pulls.update(request);

  if (response.status !== 200) {
    core.error(`PR Update failed with ${response.status}`);
  }

  // console.log(`Hello ${nameToGreet}!`);
  // const time = (new Date()).toTimeString();
  core.setOutput("URL", url);
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}