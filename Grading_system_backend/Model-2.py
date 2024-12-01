# Import necessary libraries
import pandas as pd
import numpy as np
import nltk
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MinMaxScaler
from sentence_transformers import SentenceTransformer, util
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

# Download necessary NLTK resources
nltk.download('punkt')
nltk.download('stopwords')

# Initialize SentenceTransformer for embeddings
model = SentenceTransformer('all-MiniLM-L6-v2')

# Example: Faculty-provided context (themes to evaluate)
faculty_context = "The assignment should cover sustainable development, environmental conservation, and economic growth, highlighting their interconnection and importance."

# Student assignments and grades (sample data)
data = pd.DataFrame({
    'assignment': [
        "Sustainable development is crucial to balancing environmental and economic factors for long-term stability.",
        "Economic growth often comes at the expense of the environment, requiring innovative sustainable practices.",
        "Development and sustainability must coexist for progress without harming ecological balance."
    ],
    'grade': [90, 85, 88]
})

# Step 1: Extract topics or themes from the faculty-provided context
def extract_themes(text):
    tokens = word_tokenize(text.lower())
    filtered_tokens = [word for word in tokens if word not in stopwords.words('english') and word.isalpha()]
    return list(set(filtered_tokens))  # Unique keywords

themes = extract_themes(faculty_context)
print("Extracted Themes:", themes)

# Step 2: Evaluate each student assignment based on topic coverage
def evaluate_coverage_and_features(row, themes, model):
    assignment_embedding = model.encode(row['assignment'], convert_to_tensor=True)
    
    # Topic coverage: Calculate semantic similarity for each theme
    theme_coverage_scores = []
    for theme in themes:
        theme_embedding = model.encode(theme, convert_to_tensor=True)
        similarity_score = util.pytorch_cos_sim(assignment_embedding, theme_embedding).item()
        theme_coverage_scores.append(similarity_score)
    
    # Calculate overall coverage score
    coverage_score = sum(1 for score in theme_coverage_scores if score > 0.5) / len(themes)  # Fraction of themes covered
    
    # Word count
    word_count = len(nltk.word_tokenize(row['assignment']))
    
    # Dummy grammar score (can be replaced with a real grammar checker like LanguageTool)
    grammar_score = 1.0
    
    return pd.Series([coverage_score, word_count, grammar_score])

data[['coverage_score', 'word_count', 'grammar_score']] = data.apply(
    lambda row: evaluate_coverage_and_features(row, themes, model), axis=1
)

# Step 3: Normalize features for regression
scaler = MinMaxScaler()
features = scaler.fit_transform(data[['coverage_score', 'word_count', 'grammar_score']])

# Step 4: Train a regression model
X_train, X_test, y_train, y_test = train_test_split(features, data['grade'], test_size=0.2, random_state=42)
regressor = LinearRegression()
regressor.fit(X_train, y_train)

# Predict grades
data['predicted_grade'] = regressor.predict(features)

# Step 5: Generate detailed remarks
def generate_remarks(row):
    remarks = []
    
    if row['coverage_score'] == 1.0:
        remarks.append("Excellent topic coverage.")
    elif row['coverage_score'] > 0.7:
        remarks.append("Good topic coverage, but some key points are missing.")
    else:
        remarks.append("Needs better alignment with the required themes.")
    
    if row['word_count'] < 20:
        remarks.append("Consider elaborating more on key points.")
    if row['grammar_score'] < 0.8:  # Placeholder threshold
        remarks.append("Improve grammar and sentence structure.")
    
    return " ".join(remarks)

data['remarks'] = data.apply(generate_remarks, axis=1)

# Display results
grades = data['predicted_grade'].tolist()
remarks = data['remarks'].tolist()

print("Grades:", grades)
print("Remarks:", remarks)
