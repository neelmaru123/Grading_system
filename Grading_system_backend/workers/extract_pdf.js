const fs = require('fs');

// Function to extract text and images from a PDF
async function extractTextAndImagesFromPDF(pdfFilePath) {
    try {
        // Check if the PDF file exists
        if (!fs.existsSync(pdfFilePath)) {
            throw new Error(`File not found: ${pdfFilePath}`);
        }

        // Dynamically import the ES module
        const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');

        // Load the PDF document as a binary
        const pdfBuffer = fs.readFileSync(pdfFilePath);
        const pdfData = new Uint8Array(pdfBuffer);

        // // Load the PDF document
        // console.log(pdfjsLib);
        
        const loadingTask = pdfjsLib.getDocument({ data: pdfData });
        const pdfDocument = await loadingTask.promise;

        let fullText = "";    // To store all extracted text
        let imageList = [];   // To store image references

        // Iterate over each page to extract both text and images
        for (let i = 1; i <= pdfDocument.numPages; i++) {
            const page = await pdfDocument.getPage(i);
            
            // Extract Text
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            fullText += `Page ${i}:\n${pageText}\n\n`;  // Append page's text to full text variable

            // Extract Images (search for image rendering operations in the PDF)
            const ops = await page.getOperatorList();
            for (let j = 0; j < ops.fnArray.length; j++) {
                const fn = ops.fnArray[j];

                // Check for OPS object
                if (pdfjsLib.OPS && (fn === pdfjsLib.OPS.paintImageXObject || fn === pdfjsLib.OPS.paintJpegXObject)) {
                    // Collect image reference
                    imageList.push({
                        page: i,
                        imageIndex: j,
                        operation: fn === pdfjsLib.OPS.paintImageXObject ? 'paintImageXObject' : 'paintJpegXObject',
                    });
                }
            }
        }

        // // Output the extracted text and image information
        // console.log("Extracted Text:\n", fullText);
        // console.log("Extracted Images:\n", imageList);

        return { text: fullText, images: imageList };
    } catch (error) {
        console.error("Error extracting text and images from PDF:", error.message);
    }
}

module.exports = extractTextAndImagesFromPDF;


// // Example usage
// const pdfFilePath = 'assigment-6.pdf';  // Replace with the actual path to your PDF file
// extractTextAndImagesFromPDF(pdfFilePath);
