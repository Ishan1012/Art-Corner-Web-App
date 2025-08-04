import torch
import torch.nn as nn

class Generator(nn.Module):
    def __init__(self, text_dim, noise_dim, img_channels=3):
        super().__init__()
        self.project = nn.Sequential(
            nn.Linear(text_dim + noise_dim, 128 * 8 * 8),
            nn.BatchNorm1d(128 * 8 * 8),
            nn.ReLU(True)
        )
        self.upsample = nn.Sequential(
            nn.ConvTranspose2d(128, 64, kernel_size=4, stride=2, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(True),
            nn.ConvTranspose2d(64, 32, kernel_size=4, stride=2, padding=1),
            nn.BatchNorm2d(32),
            nn.ReLU(True),
            nn.ConvTranspose2d(32, img_channels, kernel_size=4, stride=2, padding=1),
            nn.Tanh()
        )

    def forward(self, text_vec, noise):
        x = torch.cat((text_vec, noise), dim=1)
        x = self.project(x)
        x = x.view(-1, 128, 8, 8)
        return self.upsample(x)