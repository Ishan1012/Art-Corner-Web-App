import torch
import torch.nn as nn

class Generator(nn.Module):
    def __init__(self, text_dim, noise_dim, img_channels):
        super().__init__()
        input_dim = text_dim + noise_dim
        self.net = nn.Sequential(
            nn.Linear(input_dim, 512),
            nn.ReLU(),
            nn.Linear(512, 1024),
            nn.ReLU(),
            nn.Linear(1024, 3 * 64 * 64),
            nn.Tanh()
        )

    def forward(self, text_vec, noise):
        x = torch.cat((text_vec, noise), dim=1)
        x = self.net(x)
        x = x.view(-1, 3, 64, 64)
        return x
