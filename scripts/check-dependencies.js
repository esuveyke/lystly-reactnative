#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const semver = require('semver');

// Read package.json
const packageJson = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8')
);

const { dependencies, devDependencies, dependencyRules } = packageJson;

// Check if we have rules to enforce
if (!dependencyRules || !dependencyRules.rules) {
  console.log('No dependency rules found in package.json');
  process.exit(0);
}

let hasErrors = false;

// Check each rule
dependencyRules.rules.forEach((rule) => {
  const { package: pkgName, version: requiredVersion, message } = rule;
  const actualVersion = dependencies[pkgName] || devDependencies[pkgName];

  if (!actualVersion) {
    console.error(`❌ ${pkgName} is not installed but is required`);
    hasErrors = true;
    return;
  }

  // Clean the version strings
  const cleanActual = actualVersion.replace(/[\^~]/g, '');
  const cleanRequired = requiredVersion.replace(/[\^~]/g, '');

  if (!semver.satisfies(cleanActual, cleanRequired)) {
    console.error(
      `❌ ${pkgName} version mismatch: found ${actualVersion}, required ${requiredVersion}`
    );
    if (message) {
      console.error(`   Note: ${message}`);
    }
    hasErrors = true;
  } else {
    console.log(`✅ ${pkgName} version ${actualVersion} is compatible`);
  }
});

// Check Node.js version
if (packageJson.engines && packageJson.engines.node) {
  const requiredNode = packageJson.engines.node;
  if (!semver.satisfies(process.version, requiredNode)) {
    console.error(
      `❌ Node.js version ${process.version} does not satisfy required version ${requiredNode}`
    );
    hasErrors = true;
  } else {
    console.log(`✅ Node.js version ${process.version} is compatible`);
  }
}

if (hasErrors) {
  console.error('\n⚠️ Dependency checks failed. Please fix the issues above.');
  process.exit(1);
} else {
  console.log('\n✅ All dependency checks passed!');
} 