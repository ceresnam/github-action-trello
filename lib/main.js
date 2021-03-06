"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const token = core.getInput('repo-token', { required: true });
            const prNumber = getPrNumber();
            if (!prNumber) {
                console.log('Could not get pull request number from context, exiting');
                return;
            }
            const client = new github.GitHub(token);
            core.debug(`fetching details of pr #${prNumber}`);
            const prBody = yield getPrBody(client, prNumber);
            core.debug(`searching for trello links`);
            const trelloLinks = findTrelloLinks(prBody);
            for (const link of trelloLinks) {
                core.debug('  ' + link);
            }
            if (!trelloLinks || trelloLinks.length === 0) {
                core.setFailed('no trello links found');
            }
        }
        catch (error) {
            core.error(error);
            core.setFailed(error.message);
        }
    });
}
function getPrNumber() {
    const pullRequest = github.context.payload.pull_request;
    if (!pullRequest) {
        return undefined;
    }
    return pullRequest.number;
}
function getPrBody(client, prNumber) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield client.pulls.get({
            owner: github.context.repo.owner,
            repo: github.context.repo.repo,
            pull_number: prNumber,
        });
        const body = res.data.body;
        core.debug('found body: ' + body);
        return body;
    });
}
const TRELLO_LINK_RE = /https?:\/\/(www\.)?trello\.com\/(?:[^\s]+)/g;
function findTrelloLinks(s) {
    const links = s.match(TRELLO_LINK_RE) || [];
    return links;
}
run();
