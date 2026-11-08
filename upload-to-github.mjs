import fs from 'fs';
import path from 'path';

const GITHUB_TOKEN = process.argv[2] || process.env.GITHUB_TOKEN;
const REPO_NAME = 'tiktok-downloader-no-watermark';
const PROJECT_DIR = 'C:\\Users\\DELL\\.gemini\\antigravity\\scratch\\tiktok-downloader';

if (!GITHUB_TOKEN) {
  console.error('Error: GitHub token is required.');
  process.exit(1);
}

const headers = {
  Authorization: `Bearer ${GITHUB_TOKEN}`,
  Accept: 'application/vnd.github.v3+json',
  'User-Agent': 'TikTok-Downloader-Deployer',
  'Content-Type': 'application/json',
};

async function ghFetch(url, options = {}) {
  const res = await fetch(`https://api.github.com${url}`, {
    ...options,
    headers: { ...headers, ...options.headers },
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, ok: res.ok, data };
}

function getFiles(dir, base = '') {
  let results = [];
  const list = fs.readdirSync(dir);

  for (const file of list) {
    if (
      file === 'node_modules' ||
      file === '.next' ||
      file === '.git' ||
      file === '.env' ||
      file === '.env.local' ||
      file === 'scratch'
    ) {
      continue;
    }

    const fullPath = path.join(dir, file);
    const relPath = base ? `${base}/${file}` : file;
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      results = results.concat(getFiles(fullPath, relPath));
    } else {
      results.push({ fullPath, relPath });
    }
  }
  return results;
}

async function main() {
  console.log('1. Checking GitHub user authentication...');
  const userRes = await ghFetch('/user');
  if (!userRes.ok) {
    console.error('Authentication failed:', userRes.data);
    process.exit(1);
  }
  const username = userRes.data.login;
  console.log(`✓ Authenticated as: ${username}`);

  console.log(`2. Checking or creating repository: ${REPO_NAME}...`);
  let repoRes = await ghFetch(`/repos/${username}/${REPO_NAME}`);

  if (repoRes.status === 404) {
    console.log('Creating repository on GitHub...');
    const createRes = await ghFetch('/user/repos', {
      method: 'POST',
      body: JSON.stringify({
        name: REPO_NAME,
        description: 'TikTok Video Downloader Without Watermark - Next.js 15, TypeScript, Tailwind CSS',
        private: false,
        auto_init: true,
      }),
    });
    if (!createRes.ok) {
      console.error('Failed to create repo:', createRes.data);
      process.exit(1);
    }
    console.log('✓ Repository created successfully!');
    // Short delay for GitHub to initialize default branch
    await new Promise((r) => setTimeout(r, 2500));
  } else {
    console.log('✓ Repository already exists.');
  }

  console.log('3. Scanning project files...');
  const files = getFiles(PROJECT_DIR);
  console.log(`Found ${files.length} project files to upload.`);

  console.log('4. Creating Git blobs for files...');
  const treeItems = [];

  for (const { fullPath, relPath } of files) {
    const content = fs.readFileSync(fullPath).toString('base64');
    const blobRes = await ghFetch(`/repos/${username}/${REPO_NAME}/git/blobs`, {
      method: 'POST',
      body: JSON.stringify({
        content,
        encoding: 'base64',
      }),
    });

    if (!blobRes.ok) {
      console.error(`Failed to create blob for ${relPath}:`, blobRes.data);
      continue;
    }

    treeItems.push({
      path: relPath.replace(/\\/g, '/'),
      mode: '100644',
      type: 'blob',
      sha: blobRes.data.sha,
    });
    process.stdout.write('.');
  }
  console.log(`\n✓ Uploaded ${treeItems.length} blobs.`);

  console.log('5. Creating Git Tree...');
  const treeRes = await ghFetch(`/repos/${username}/${REPO_NAME}/git/trees`, {
    method: 'POST',
    body: JSON.stringify({ tree: treeItems }),
  });
  if (!treeRes.ok) {
    console.error('Failed to create tree:', treeRes.data);
    process.exit(1);
  }
  const treeSha = treeRes.data.sha;
  console.log(`✓ Tree created: ${treeSha}`);

  console.log('6. Checking current commit SHA...');
  let parentCommitSha = null;
  const refRes = await ghFetch(`/repos/${username}/${REPO_NAME}/git/ref/heads/main`);
  if (refRes.ok) {
    parentCommitSha = refRes.data.object.sha;
  } else {
    // Check master branch fallback
    const masterRes = await ghFetch(`/repos/${username}/${REPO_NAME}/git/ref/heads/master`);
    if (masterRes.ok) parentCommitSha = masterRes.data.object.sha;
  }

  console.log('7. Creating commit...');
  const commitRes = await ghFetch(`/repos/${username}/${REPO_NAME}/git/commits`, {
    method: 'POST',
    body: JSON.stringify({
      message: 'Initial commit: Complete TikTok Downloader Without Watermark web app',
      tree: treeSha,
      parents: parentCommitSha ? [parentCommitSha] : [],
    }),
  });
  if (!commitRes.ok) {
    console.error('Failed to create commit:', commitRes.data);
    process.exit(1);
  }
  const commitSha = commitRes.data.sha;
  console.log(`✓ Commit created: ${commitSha}`);

  console.log('8. Updating branch ref to heads/main...');
  let updateRefRes = await ghFetch(`/repos/${username}/${REPO_NAME}/git/refs/heads/main`, {
    method: 'PATCH',
    body: JSON.stringify({
      sha: commitSha,
      force: true,
    }),
  });

  if (!updateRefRes.ok) {
    // If heads/main didn't exist yet, create it
    updateRefRes = await ghFetch(`/repos/${username}/${REPO_NAME}/git/refs`, {
      method: 'POST',
      body: JSON.stringify({
        ref: 'refs/heads/main',
        sha: commitSha,
      }),
    });
  }

  if (!updateRefRes.ok) {
    console.error('Failed to update ref:', updateRefRes.data);
    process.exit(1);
  }

  const finalUrl = `https://github.com/${username}/${REPO_NAME}`;
  console.log('\n======================================================');
  console.log('🎉 SUCCESS! PROJECT UPLOADED TO GITHUB:');
  console.log(finalUrl);
  console.log('======================================================\n');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
