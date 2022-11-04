/* global console */
import * as core from '@actions/core';
import { context } from '@actions/github';

try {
  // `who-to-greet` input defined in action metadata file
  // const nameToGreet = core.getInput('who-to-greet');
  const jiraAccount = core.getInput('jira-account');
  const ticketRegex = new RegExp(core.getInput('ticket-regex') || '[A-Z]+-\\d+');
  const headBranch = context.payload.pull_request.head.ref;
  const [ticketId] = headBranch.match(ticketRegex) || ['GOONIES-123'];

  const url = `https://${jiraAccount}.atlassian.net/browse/${ticketId}`;

  // console.log(`Hello ${nameToGreet}!`);
  // const time = (new Date()).toTimeString();
  core.setOutput("URL", url);
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}