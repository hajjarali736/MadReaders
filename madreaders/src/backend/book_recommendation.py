from flask import Flask, jsonify, request
from flask_cors import CORS
import google.generativeai as genai
import os
from dotenv import load_dotenv
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure Google's Generative AI
try:
    api_key = os.getenv('GOOGLE_API_KEY')
    if not api_key:
        logger.error("GOOGLE_API_KEY not found in environment variables")
    else:
        logger.info("Found GOOGLE_API_KEY, configuring Generative AI...")
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-pro')
        logger.info("Generative AI configured successfully")
except Exception as e:
    logger.error(f"Error configuring Generative AI: {str(e)}")

# Sample book database
books = [
    {
        "title": "To Kill a Mockingbird",
        "author": "Harper Lee",
        "description": "A story of racial injustice and the loss of innocence in the American South.",
        "genre": "Fiction"
    },
    {
        "title": "1984",
        "author": "George Orwell",
        "description": "A dystopian novel about totalitarianism and surveillance.",
        "genre": "Science Fiction"
    },
    {
        "title": "The Great Gatsby",
        "author": "F. Scott Fitzgerald",
        "description": "A story of wealth, love, and the American Dream in the 1920s.",
        "genre": "Fiction"
    },
    {
        "title": "Pride and Prejudice",
        "author": "Jane Austen",
        "description": "A romantic novel about the Bennet family and their relationships.",
        "genre": "Romance"
    },
    {
        "title": "The Hobbit",
        "author": "J.R.R. Tolkien",
        "description": "A fantasy adventure about a hobbit's journey to reclaim treasure.",
        "genre": "Fantasy"
    }
]

def get_ai_recommendation(prompt):
    try:
        logger.info(f"Generating recommendation for prompt: {prompt}")
        response = model.generate_content(
            f"""You are a book recommendation assistant. Based on this user prompt: '{prompt}', 
            recommend books from this database: {books}. 
            Return only the books that best match the user's request, along with a brief explanation 
            of why you're recommending each book."""
        )
        logger.info("Successfully generated recommendation")
        return response.text
    except Exception as e:
        logger.error(f"Error generating AI recommendation: {str(e)}")
        return None

def find_matching_books(prompt):
    prompt = prompt.lower()
    matches = []
    for book in books:
        if (prompt in book["title"].lower() or 
            prompt in book["description"].lower() or 
            prompt in book["genre"].lower()):
            matches.append(book)
    return matches

@app.route('/recommend', methods=['POST'])
def recommend():
    try:
        prompt = request.json.get('prompt', '')
        logger.info(f"Received recommendation request for prompt: {prompt}")
        
        if not prompt:
            return jsonify({"error": "Please enter a prompt"})
        
        # Get AI-powered recommendation
        ai_recommendation = get_ai_recommendation(prompt)
        
        # Get direct matches from our database
        matches = find_matching_books(prompt)
        
        if ai_recommendation:
            logger.info("Returning AI recommendation with matches")
            return jsonify({
                "books": matches,
                "ai_recommendation": ai_recommendation
            })
        elif matches:
            logger.info("Returning direct matches")
            return jsonify({"books": matches})
        else:
            logger.info("No matches found")
            return jsonify({"message": "No books found matching your prompt. Try something else!"})
    except Exception as e:
        logger.error(f"Error in recommend endpoint: {str(e)}")
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True) 