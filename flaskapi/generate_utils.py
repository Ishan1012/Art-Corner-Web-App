import torch
from PIL import Image
import numpy as np
import pickle
from model import Generator

def generate_image_from_caption(caption, model_path="generator_model.pth", vectorizer_path="vectorizer.pkl", save=True):
    # Load vectorizer
    with open(vectorizer_path, 'rb') as f:
        vectorizer = pickle.load(f)

    # Load model
    generator = Generator(text_dim=100, noise_dim=100, img_channels=3)
    generator.load_state_dict(torch.load(model_path, map_location=torch.device('cpu')))
    generator.eval()

    # Vectorize input text
    text_vec = vectorizer.transform([caption]).toarray()
    text_tensor = torch.tensor(text_vec, dtype=torch.float32)

    # Create random noise
    noise = torch.randn(1, 100)

    # Generate image
    with torch.no_grad():
        generated_img = generator(text_tensor, noise).squeeze()
        img_np = ((generated_img.permute(1, 2, 0).numpy() + 1) * 127.5).astype(np.uint8)
        img = Image.fromarray(img_np)

    return img  # return PIL Image
