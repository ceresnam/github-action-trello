import * as core from '@actions/core';
import * as github from '@actions/github';
import { Response, PullsGetResponse } from '@octokit/rest';

async function run() {
    try {
        const token = core.getInput('repo-token', {required: true});

        const prNumber = getPrNumber();
        if (!prNumber) {
            console.log('Could not get pull request number from context, exiting');
            return;
        }

        const client = new github.GitHub(token);

        core.debug(`fetching details of pr #${prNumber}`);
        const prBody = await getPrBody(client, prNumber);

        core.debug(`searching for trello links`);
        const trelloLinks: string[] = findTrelloLinks(prBody);
        for (const link of trelloLinks) {
            core.debug('  ' + link);
        }

        if (!trelloLinks || trelloLinks.length === 0) {
            core.setFailed('no trello links found')
        }
    } catch (error) {
        core.error(error);
        core.setFailed(error.message);
    }
}

function getPrNumber(): number | undefined {
    const pullRequest = github.context.payload.pull_request;
    if (!pullRequest) {
        return undefined;
    }

    return pullRequest.number;
}

async function getPrBody(client: github.GitHub, prNumber: number): Promise<string> {
    const res: Response<PullsGetResponse> = await client.pulls.get({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        pull_number: prNumber,
    });

    const body: string = res.data.body;
    core.debug('found body: ' + body);
    return body;
}

const TRELLO_LINK_RE = /https?:\/\/(www\.)?trello\.com\/(?:[^\s]+)/g;

function findTrelloLinks(s: string): string[] {
    const links = s.match(TRELLO_LINK_RE) || [];
    return links
}

run();
