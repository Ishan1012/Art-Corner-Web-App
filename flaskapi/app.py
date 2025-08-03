from flask import Flask, request, jsonify
from generate_utils import generate_image_from_caption
from flask_cors import CORS
import io
import base64

from upscale_img import upscale_image

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return "Text-to-Image Flask API is running!"

@app.route('/generate', methods=['POST'])
def generate():
    data = request.json
    if not data or 'caption' not in data:
        return jsonify({'error': 'No caption provided'}), 400

    caption = data['caption']
    try:
        # Generate PIL image in memory
        image = generate_image_from_caption(caption)
        img_upscaled = upscale_image(image)


        # Convert image to base64
        img_io = io.BytesIO()
        img_upscaled.save(img_io, 'PNG')
        img_io.seek(0)
        img_base64 = base64.b64encode(img_io.read()).decode('utf-8')

        return jsonify({'image_base64': img_base64})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
