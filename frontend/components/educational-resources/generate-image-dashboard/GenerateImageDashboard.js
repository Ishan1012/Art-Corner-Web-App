'use client';
import React, { useState, useCallback, useEffect } from 'react';
import { Download, ImageIcon, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { toast } from 'react-toastify';
import { Buffer } from 'buffer';
import { getUser } from '@/services/UserService';
import { LoadingPage } from '@/components/accessibility-features/loading-page/LoadingPage';
import generateImage from '@/services/GenerateImageService';

const AIImageGenerator = () => {
  const [user, setUser] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [generationsToday, setGenerationsToday] = useState(0);
  const [progress, setProgress] = useState(0);

  const MAX_GENERATIONS_PER_DAY = 3;

  useEffect(() => {
    const fetchUser = async () => {
      const data = await getUser();

      if (data && data._id) {
        setUser(data);
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const handleGenerateImage = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt to generate an image');
      return;
    }

    if (!user) {
      setError('Please sign in to generate an image');
      return;
    }

    if (generationsToday >= MAX_GENERATIONS_PER_DAY) {
      setError('Daily generation limit reached (3/day). Please try again tomorrow.');
      return;
    }

    setIsGenerating(true);
    setError('');
    setProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 15;
        });
      }, 200);

      console.log(user.id, prompt);
      const data = await generateImage(user.id, prompt);

      clearInterval(progressInterval);
      setProgress(100);

      if (!data || !data.img?.data || !data.contentType) {
        setError('Failed to generate image. Please try again later.');
        return;
      }

      const base64 = Buffer.from(data.img.data).toString('base64');
      const imageSrc = `data:${data.contentType};base64,${base64}`;

      setGeneratedImage({
        img: imageSrc,
        responseText: data.responseText,
        timestamp: new Date().toISOString(),
      });

      setGenerationsToday((prev) => prev + 1);
    } catch (err) {
      setError('Failed to generate image. Please try again.');
      console.error('Generation error:', err);
    } finally {
      setIsGenerating(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };


  const downloadImage = useCallback(() => {
    if (!generatedImage?.img) return;

    try {
      const link = document.createElement('a');
      link.href = generatedImage.img; // base64 image string
      link.download = `ai-generated-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      setError('Failed to download image');
      console.error('Download error:', err);
    }
  }, [generatedImage]);

  if (loading) {
    return <LoadingPage />;
  }

  if (!user) {
    return (
      <div className="d-flex align-items-center justify-content-center vh-100 bg-white text-center">
        <div>
          <ImageIcon className="mb-3" size={48} color="gray" />
          <h2 className="h5">Authentication Required</h2>
          <p className="text-muted">Please log in to use the AI Image Generator</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-vh-100">
      {/* Header */}
      <header className="border-bottom py-4 mb-4">
        <div className="container d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-3">
            <Sparkles size={32} color="#ffc107" />
            <h1 className="h4 m-0">AI Image Generator</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mb-4">
        <div className="row g-4">
          {/* Left Column - Input */}
          <div className="col-lg-6">
            <div className="mb-3">
              <label htmlFor="prompt" className="form-label">Describe your image</label>
              <textarea
                id="prompt"
                className="form-control"
                rows="6"
                value={prompt}
                disabled={isGenerating}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="A beautiful sunset over mountains, oil painting style..."
              ></textarea>
            </div>

            {error && (
              <div className="alert alert-danger d-flex align-items-center" role="alert">
                <AlertCircle className="me-2" size={20} />
                <div>{error}</div>
              </div>
            )}

            <button
              onClick={handleGenerateImage}
              className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
              style={{ backgroundColor: '#ffc107', borderColor: '#ffc107' }}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="spinner-border spinner-border-sm" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Generate Image
                </>
              )}
            </button>

            {isGenerating && (
              <div className="mt-3">
                <div className="d-flex justify-content-between small mb-1">
                  <span>Generating your image</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="progress">
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{ width: `${progress}%`, backgroundColor: '#ffc107' }}
                    aria-valuenow={progress}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Output */}
          <div className="col-lg-6">
            <div className="border rounded position-relative" style={{ aspectRatio: '1/1', backgroundColor: '#f8f9fa' }}>
              {generatedImage ? (
                <>
                  <img
                    src={generatedImage.img}
                    alt="Generated"
                    className="img-fluid w-100 h-100 object-fit-cover rounded"
                    style={{ objectFit: 'cover' }}
                  />
                  <button
                    onClick={downloadImage}
                    className="btn btn-light position-absolute top-0 end-0 m-2"
                    title="Download image"
                  >
                    <Download size={18} />
                  </button>
                </>
              ) : (
                <div className="d-flex flex-column align-items-center justify-content-center h-100 text-muted">
                  <ImageIcon size={32} className="mb-2" />
                  <p>Your generated image will appear here</p>
                </div>
              )}
            </div>

            {generatedImage && (
              <div className="bg-light border rounded p-3 mt-3">
                <p className="text-muted small mb-0">
                  Generated on {new Date(generatedImage.timestamp).toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-light border rounded p-4 mt-5">
          <h4 className="mb-4">How it works</h4>
          <div className="row text-muted small">
            <div className="col-md-4 mb-3">
              <div className="d-flex align-items-start">
                <div className="badge rounded-circle bg-danger me-2">1</div>
                <p className="mb-0">Describe the image you want to create in the text area</p>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="d-flex align-items-start">
                <div className="badge rounded-circle bg-danger me-2">2</div>
                <p className="mb-0">Our AI model processes your prompt and generates a unique image</p>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="d-flex align-items-start">
                <div className="badge rounded-circle bg-danger me-2">3</div>
                <p className="mb-0">Download your generated image in high quality</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AIImageGenerator;
