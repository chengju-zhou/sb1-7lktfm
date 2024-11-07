import React, { useState } from 'react';
import { Image as ImageIcon, Upload, LayoutGrid, ImagePlus, Images } from 'lucide-react';
import ImageCanvas from './components/ImageCanvas';
import Controls from './components/Controls';
import TextOverlay from './components/TextOverlay';

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?auto=format&fit=crop&q=80&w=1000";

interface ImageState {
  currentImage: string;
  brightness: number;
  contrast: number;
  blur: number;
  grayscale: boolean;
  overlayText: string;
  textPosition: { x: number; y: number };
  textColor: string;
  fontSize: number;
}

const defaultImageState: ImageState = {
  currentImage: DEFAULT_IMAGE,
  brightness: 0,
  contrast: 0,
  blur: 0,
  grayscale: false,
  overlayText: '',
  textPosition: { x: 50, y: 50 },
  textColor: '#ffffff',
  fontSize: 24,
};

function App() {
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [imageStates, setImageStates] = useState<ImageState[]>([
    { ...defaultImageState },
    { ...defaultImageState },
    { ...defaultImageState },
  ]);

  const tabs = [
    { icon: LayoutGrid, label: 'Layout 1' },
    { icon: ImagePlus, label: 'Layout 2' },
    { icon: Images, label: 'Layout 3' },
  ];

  const handleReset = (index: number) => {
    setImageStates(prev => {
      const newStates = [...prev];
      newStates[index] = { ...defaultImageState };
      return newStates;
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsLoading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageStates(prev => {
          const newStates = [...prev];
          newStates[index] = {
            ...newStates[index],
            currentImage: reader.result as string,
          };
          return newStates;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const updateImageState = (index: number, updates: Partial<ImageState>) => {
    setImageStates(prev => {
      const newStates = [...prev];
      newStates[index] = { ...newStates[index], ...updates };
      return newStates;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Navigation Sidebar */}
      <div className="w-20 bg-white shadow-lg flex flex-col items-center py-8 gap-4">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`p-3 rounded-lg transition-all duration-200 ${
              activeTab === index
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <tab.icon className="w-6 h-6" />
            <span className="text-xs mt-1 block">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 py-8 px-4 sm:px-6 lg:px-8 overflow-y-auto">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <ImageIcon className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Image Processing Demo</h1>
          </div>
          <p className="text-gray-600">Experiment with various image processing effects</p>
        </header>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Original Image */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800 text-center">Original Image</h2>
              <div className="relative">
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                  </div>
                )}
                <ImageCanvas
                  imageUrl={imageStates[activeTab].currentImage}
                  brightness={0}
                  contrast={0}
                  blur={0}
                  grayscale={false}
                  onImageLoad={() => setIsLoading(false)}
                  overlayText=""
                  textPosition={imageStates[activeTab].textPosition}
                  textColor={imageStates[activeTab].textColor}
                  fontSize={imageStates[activeTab].fontSize}
                />
              </div>
              
              <label className="flex items-center justify-center w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 cursor-pointer gap-2">
                <Upload className="w-5 h-5" />
                Upload Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, activeTab)}
                  className="hidden"
                />
              </label>
            </div>

            {/* Controls */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-800 text-center">Controls</h2>
              <Controls
                brightness={imageStates[activeTab].brightness}
                contrast={imageStates[activeTab].contrast}
                blur={imageStates[activeTab].blur}
                grayscale={imageStates[activeTab].grayscale}
                onBrightnessChange={(value) => updateImageState(activeTab, { brightness: value })}
                onContrastChange={(value) => updateImageState(activeTab, { contrast: value })}
                onBlurChange={(value) => updateImageState(activeTab, { blur: value })}
                onGrayscaleChange={(value) => updateImageState(activeTab, { grayscale: value })}
              />

              <TextOverlay
                text={imageStates[activeTab].overlayText}
                onTextChange={(value) => updateImageState(activeTab, { overlayText: value })}
                textColor={imageStates[activeTab].textColor}
                onColorChange={(value) => updateImageState(activeTab, { textColor: value })}
                fontSize={imageStates[activeTab].fontSize}
                onFontSizeChange={(value) => updateImageState(activeTab, { fontSize: value })}
                textPosition={imageStates[activeTab].textPosition}
                onPositionChange={(value) => updateImageState(activeTab, { textPosition: value })}
              />
              
              <button
                onClick={() => handleReset(activeTab)}
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Reset All Effects
              </button>
            </div>

            {/* Processed Images */}
            <div className="space-y-4">
              {/* Main processed image */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800 text-center mb-4">Processed Image</h2>
                <div className="relative">
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                    </div>
                  )}
                  <ImageCanvas
                    imageUrl={imageStates[activeTab].currentImage}
                    brightness={imageStates[activeTab].brightness}
                    contrast={imageStates[activeTab].contrast}
                    blur={imageStates[activeTab].blur}
                    grayscale={imageStates[activeTab].grayscale}
                    onImageLoad={() => setIsLoading(false)}
                    overlayText={imageStates[activeTab].overlayText}
                    textPosition={imageStates[activeTab].textPosition}
                    textColor={imageStates[activeTab].textColor}
                    fontSize={imageStates[activeTab].fontSize}
                  />
                </div>
              </div>

              {/* Grayscale version */}
              <div>
                <h3 className="text-md font-medium text-gray-800 text-center mb-4">Grayscale Preview</h3>
                <div className="relative">
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                    </div>
                  )}
                  <ImageCanvas
                    imageUrl={imageStates[activeTab].currentImage}
                    brightness={imageStates[activeTab].brightness}
                    contrast={imageStates[activeTab].contrast}
                    blur={imageStates[activeTab].blur}
                    grayscale={true}
                    onImageLoad={() => setIsLoading(false)}
                    overlayText={imageStates[activeTab].overlayText}
                    textPosition={imageStates[activeTab].textPosition}
                    textColor={imageStates[activeTab].textColor}
                    fontSize={imageStates[activeTab].fontSize}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;