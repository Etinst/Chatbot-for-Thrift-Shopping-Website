from flask import Flask, render_template, request, jsonify
from flask_cors import CORS  # Add this import
from chat import get_response

app = Flask(__name__, static_folder='static', template_folder='templates')
CORS(app)  # Enable CORS for all routes

@app.route('/')
def home():
    return render_template('base.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        if not data or 'message' not in data:
            return jsonify({'answer': 'Please provide a message'}), 400
        
        text = data['message']
        response = get_response(text)
        return jsonify({'answer': response})
    except Exception as e:
        print(f"Error in predict endpoint: {str(e)}")
        return jsonify({'answer': "Sorry, I encountered an error. Please try again."}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)