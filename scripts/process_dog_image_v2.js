const fs = require('fs');
const { execSync } = require('child_process');

try {
    console.log("Checking sharp...");
    try {
        require.resolve('sharp');
        console.log("Sharp found.");
    } catch (e) {
        console.log("Installing sharp...");
        execSync('npm install sharp', { stdio: 'inherit' });
    }

    const sharp = require('sharp');
    const input = "dog sitting outside.png";
    const output = "pages/dog-memorial-stones/images/dog-memorial-forest.webp";

    if (!fs.existsSync(input)) {
        console.error(`Input file not found: ${input}`);
        // If input is gone, maybe we already processed it?
        if (fs.existsSync(output)) {
            console.log("Output already exists. Assuming success from previous run.");
            process.exit(0);
        }
        process.exit(1);
    }

    console.log(`Processing ${input} -> ${output}`);

    sharp(input)
        .resize({ width: 1200, withoutEnlargement: true })
        .webp({ quality: 85 })
        .toFile(output)
        .then(() => {
            console.log("Success.");
            fs.unlinkSync(input);
            console.log("Deleted original.");
        })
        .catch(err => {
            console.error("Sharp Error:", err);
            process.exit(1);
        });

} catch (e) {
    console.error("Script Error:", e);
    process.exit(1);
}
