const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

async function run() {
    try {
        console.log("Installing sharp...");
        execSync('npm install sharp', { stdio: 'inherit' });
        const sharp = require('sharp');

        const input = "dog sitting outside.png";
        const output = "pages/dog-memorial-stones/images/dog-memorial-forest.webp";

        console.log(`Processing ${input} -> ${output}`);

        await sharp(input)
            .resize({ width: 1200, withoutEnlargement: true })
            .webp({ quality: 85 })
            .toFile(output);

        console.log("Image processed successfully.");

        // Delete original if successful
        if (fs.existsSync(input)) {
            fs.unlinkSync(input);
            console.log("Deleted original PNG.");
        }

    } catch (e) {
        console.error("Error:", e);
        process.exit(1);
    }
}

run();
