# Import necessary libraries
import pandas as pd
import numpy as np
import nltk
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, r2_score
from sklearn.preprocessing import MinMaxScaler
from sentence_transformers import SentenceTransformer, util

# Download NLTK resources for text processing
nltk.download('punkt')

# Initialize SentenceTransformer for embeddings
model = SentenceTransformer('all-MiniLM-L6-v2')

# Sample data: Faculty sample, student assignments, and grades
data = pd.DataFrame({
    'sample': [
        "The importance of sustainable development lies in balancing environmental conservation with economic growth."
    ] * 3,  # Repeat the single sample to match the number of assignments
    'assignment': [
        "Sustainable development is crucial to maintaining ecological balance while achieving economic progress.",
        "Economic growth often comes at the expense of environmental health, highlighting the need for sustainable practices.",
        "Development and sustainability are essential for long-term ecological and economic stability."
    ],
    'grade': [90, 85, 88]  # Grades provided by faculty as ground truth
})

# Preprocessing: Calculate similarity, word count, and grammar score (dummy for now)
def preprocess_and_feature_engineer(row):
    sample_embedding = model.encode(row['sample'], convert_to_tensor=True)
    assignment_embedding = model.encode(row['assignment'], convert_to_tensor=True)
    similarity_score = util.pytorch_cos_sim(sample_embedding, assignment_embedding).item()

    word_count = len(nltk.word_tokenize(row['assignment']))
    grammar_score = 1.0  # Placeholder for now

    return pd.Series([similarity_score, word_count, grammar_score])

data[['similarity', 'word_count', 'grammar_score']] = data.apply(preprocess_and_feature_engineer, axis=1)

# Normalize features for model input
scaler = MinMaxScaler()
features = scaler.fit_transform(data[['similarity', 'word_count', 'grammar_score']])

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(features, data['grade'], test_size=0.2, random_state=42)

# Train a regression model
regressor = LinearRegression()
regressor.fit(X_train, y_train)

# Predict grades for the full dataset
data['predicted_grade'] = regressor.predict(features)

# Generate remarks based on extracted features
def generate_remarks(row):
    remarks = []
    if row['similarity'] > 0.8:
        remarks.append("Excellent alignment with the provided sample.")
    elif row['similarity'] > 0.6:
        remarks.append("Good alignment with the provided sample but could be improved.")
    else:
        remarks.append("Needs better alignment with the sample content.")
    
    if row['word_count'] < 20:
        remarks.append("Consider elaborating more on key points.")
    if row['grammar_score'] < 0.8:  # Placeholder threshold
        remarks.append("Improve grammar and sentence structure.")

    return " ".join(remarks)

data['remarks'] = data.apply(generate_remarks, axis=1)

# Extract grades and remarks
grades = data['predicted_grade'].tolist()
remarks = data['remarks'].tolist()

# Display results
grades, remarks
