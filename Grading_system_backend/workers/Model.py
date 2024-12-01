from flask import Flask, request, jsonify
import nltk
from sentence_transformers import SentenceTransformer, util
import json

# Initialize Flask app
app = Flask(__name__)

# Download NLTK resources for text processing
nltk.download('punkt', quiet=True)

# Initialize SentenceTransformer model
model = SentenceTransformer('all-MiniLM-L6-v2')

def process_assignment(sample, assignment):
    # Encode the sample and assignment using SentenceTransformer
    sample_embedding = model.encode(sample, convert_to_tensor=True)
    assignment_embedding = model.encode(assignment, convert_to_tensor=True)

    # Calculate similarity score
    similarity_score = util.pytorch_cos_sim(sample_embedding, assignment_embedding).item()

    # Calculate word count and dummy grammar score
    word_count = len(nltk.word_tokenize(assignment))
    grammar_score = 1.0  # Placeholder for grammar score

    # Generate remarks based on similarity, word count, and grammar
    remarks = []
    if similarity_score > 0.8:
        remarks.append("Excellent alignment with the provided sample.")
    elif similarity_score > 0.6:
        remarks.append("Good alignment with the provided sample but could be improved.")
    else:
        remarks.append("Needs better alignment with the sample content.")
    
    if word_count < 20:
        remarks.append("Consider elaborating more on key points.")
    if grammar_score < 0.8:
        remarks.append("Improve grammar and sentence structure.")

    # Return the grade and remarks
    grade = similarity_score * 100  # Example conversion of similarity to a percentage grade (0–100 scale)
    if grade > 85:
        grade = "A+"
    elif grade < 85 and grade > 70:
        grade = "A"
    elif grade < 70 and grade > 60:
        grade = "B+"
    elif grade < 60 and grade > 45:
        grade = "B"
    else :
        grade = "C"
        
    return {
        "grade": grade,
        "remarks": " ".join(remarks)
    }

# API endpoint to process a single sample and assignment
@app.route('/process', methods=['POST'])
def process():
    try:
        # Parse JSON input
        input_data = request.json
        sample = input_data.get('sample')
        assignment = input_data.get('assignment')

        # Validate input
        if not sample or not assignment:
            return jsonify({"status": "error", "message": "Invalid input. 'sample' and 'assignment' are required."}), 400

        # Process the assignment
        result = process_assignment(sample, assignment)
        return jsonify({"status": "success", "data": result})

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# Run the Flask app
if __name__ == '__main__':
    app.run(port=5000, debug=True)
