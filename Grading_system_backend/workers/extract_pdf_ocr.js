const poppler = require('pdf-poppler');
const Tesseract = require('tesseract.js');
const path = require('path');
const fs = require('fs');
const os = require('os');  // For parallel processing

// PDF to Image Conversion
async function convertPdfToImage(pdfPath) {
    const normalizedPdfPath = path.normalize(pdfPath);
    const outputDir = path.normalize(path.dirname(pdfPath)); // Ensure correct path
    const outputPrefix = path.basename(pdfPath, path.extname(pdfPath)); // Without extension
    
    let opts = {
        format: 'png',
        out_dir: outputDir,
        out_prefix: outputPrefix,
        page: null // Convert all pages
    };

    try {
        await poppler.convert(normalizedPdfPath, opts);
        console.log('PDF converted to images successfully!');
    } catch (err) {
        console.error('Error converting PDF to images:', err);
    }
}

// OCR Process on Single Image
async function runOcrOnImage(imagePath) {
    return new Promise((resolve, reject) => {
        Tesseract.recognize(imagePath, 'eng', {
            logger: m => console.log(m) // Log progress
        })
        .then(({ data: { text } }) => {
            console.log(`OCR Completed for: ${imagePath}`);
            resolve(text); // Return extracted text
        })
        .catch(err => {
            console.error(`Error during OCR on image ${imagePath}:`, err);
            reject(err);
        });
    });
}

// Function to Compare Texts for Differences
function detectDifferences(baselineText, currentText) {
    // Simple difference detection by comparing the texts
    if (baselineText.trim() !== currentText.trim()) {
        console.log('Difference detected between pages.');
        return true; // Difference detected
    }
    return false; // No difference
}

// Parallel OCR Processing
async function processImagesInParallel(imagePaths, baselineText = null) {
    const cpuCount = os.cpus().length; // Number of logical CPUs
    const batchSize = Math.ceil(imagePaths.length / cpuCount);

    const results = [];

    // Process each batch in parallel
    for (let i = 0; i < imagePaths.length; i += batchSize) {
        const batch = imagePaths.slice(i, i + batchSize);
        const batchResults = await Promise.all(batch.map(imagePath => runOcrOnImage(imagePath)));

        batchResults.forEach((ocrText, idx) => {
            const pageIndex = i + idx + 1;

            // If baselineText is provided, detect differences
            if (baselineText) {
                if (detectDifferences(baselineText, ocrText)) {
                    console.log(`Difference detected on page ${pageIndex}. Processing accordingly.`);
                    // You can add custom processing for different pages here
                } else {
                    console.log(`No significant difference found on page ${pageIndex}.`);
                }
            }

            results.push(ocrText);
        });
    }

    return results;
}

// Main Function
async function processPdfWithOcr(pdfPath) {
    // Convert the PDF to images
    await convertPdfToImage(pdfPath);

    // Directory of the output images
    const outputDir = path.normalize(path.dirname(pdfPath));
    
    // Prefix for images based on PDF name
    const outputPrefix = path.basename(pdfPath, path.extname(pdfPath));

    // Get image files that match the prefix and are in PNG format
    const imageFiles = fs.readdirSync(outputDir)
        .filter(file => file.startsWith(outputPrefix) && file.endsWith('.png'));

    if (imageFiles.length === 0) {
        console.error('No images were found after PDF conversion.');
        return;
    }

    // Get full paths of all the images
    const imagePaths = imageFiles.map(file => path.join(outputDir, file));

    // Run OCR on the first image to use it as a baseline for comparison
    const baselineText = await runOcrOnImage(imagePaths[0]);
    console.log('Baseline OCR Text:', baselineText);

    // Run OCR in parallel on the remaining images and detect differences
    const ocrResults = await processImagesInParallel(imagePaths.slice(1), baselineText);

    // Combine baseline with the rest
    ocrResults.unshift(baselineText);

    console.log('All OCR results:', ocrResults.join('\n'));
}

// Example Usage
const pdfFilePath = "E:/Sem-5/CN/assigment - 3.pdf"; // Ensure this path is correct
processPdfWithOcr(pdfFilePath)
    .then(() => console.log('PDF processing complete.'))
    .catch(err => console.error('Error during PDF processing:', err));
