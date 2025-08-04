from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
import pickle
import io
import base64
from torchvision import transforms

from upscale_img import upscale_image
from model import Generator  # Make sure this is the updated 128x128 Generator

# Load TF-IDF vectorizer
with open("vectorizer.pkl", "rb") as f:
    vectorizer = pickle.load(f)

# Setup device
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Create and load the generator
text_dim = vectorizer.transform(["dummy"]).shape[1]
generator = Generator(text_dim=text_dim, noise_dim=100, img_channels=3).to(device)

# Clean and load model weights
state_dict = torch.load("generator_model.pth", map_location=device)
cleaned_state_dict = {k.replace("_orig_mod.", ""): v for k, v in state_dict.items()}
generator.load_state_dict(cleaned_state_dict)
generator.eval()

# Flask app
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
        # Vectorize the caption
        text_vec = vectorizer.transform([caption]).toarray()
        text_tensor = torch.tensor(text_vec, dtype=torch.float).to(device)

        # Generate noise
        noise = torch.randn(1, 100).to(device)

        # Generate image
        with torch.no_grad():
            output = generator(text_tensor, noise)

        # Convert to PIL Image
        output_img = output.squeeze(0).cpu()
        output_img = (output_img + 1) / 2  # De-normalize [-1, 1] to [0, 1]
        output_img_pil = transforms.ToPILImage()(output_img)

        # Optional: Upscale the image
        upscaled_img = upscale_image(output_img_pil)

        # Convert to base64
        img_io = io.BytesIO()
        upscaled_img.save(img_io, format='PNG')
        img_io.seek(0)
        img_base64 = base64.b64encode(img_io.read()).decode('utf-8')

        return jsonify({'image_base64': img_base64})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
