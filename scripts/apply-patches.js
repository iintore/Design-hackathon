const fs = require('fs');
const path = require('path');

const targets = [
  path.join(__dirname, '../node_modules/expo/node_modules/@expo/cli/build/src/start/platforms/ios/AppleDeviceManager.js'),
  path.join(__dirname, '../node_modules/@expo/cli/build/src/start/platforms/ios/AppleDeviceManager.js')
];

let applied = false;

for (const targetPath of targets) {
  if (fs.existsSync(targetPath)) {
    console.log(`Checking ${targetPath}...`);
    let content = fs.readFileSync(targetPath, 'utf8');
    
    // Check if already patched
    if (content.includes("d.name === 'iPhone 16 Pro'")) {
      console.log(`Patch already applied to ${targetPath}.`);
      applied = true;
      continue;
    }
    
    // Flexible regex matching for both \n and \r\n and whitespace variations
    const targetRegex = /async\s+function\s+ensureSimulatorOpenAsync\s*\(\s*{\s*udid\s*,\s*osType\s*}\s*=\s*\{\}\s*,\s*tryAgain\s*=\s*true\s*\)\s*\{\s*\/\/\s*Use\s+a\s+default\s+simulator\s+if\s+none\s+was\s+specified\s*if\s*\(\s*!udid\s*\)\s*\{\s*\/\/\s*If\s+a\s+simulator\s+is\s+open/;
    
    if (targetRegex.test(content)) {
      const replacementStr = `async function ensureSimulatorOpenAsync({ udid, osType } = {}, tryAgain = true) {
    // Use a default simulator if none was specified
    if (!udid) {
        try {
            const simulators = await (0, _getBestSimulator.getSelectableSimulatorsAsync)({ osType });
            const iphone16Pro = simulators.find((d) => d.name === 'iPhone 16 Pro');
            if (iphone16Pro) {
                udid = iphone16Pro.udid;
            }
        } catch (e) {}
    }
    if (!udid) {
        // If a simulator is open`;
      
      content = content.replace(targetRegex, replacementStr);
      fs.writeFileSync(targetPath, content, 'utf8');
      console.log(`Successfully patched ${targetPath}`);
      applied = true;
    } else {
      console.warn(`Target pattern not found in ${targetPath}. Unable to apply patch.`);
    }
  }
}

if (!applied) {
  console.error("Error: Could not apply patch to any of the target paths.");
  process.exit(1);
} else {
  console.log("Patch verification complete.");
}
