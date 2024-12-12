'use client';

import { ImagePlus, LoaderPinwheel } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import Style from './style';
import { Button } from './ui/button';
import thumbnai1 from "@/assets/thumbnail (2).png"
import thumbnai2 from "@/assets/thumbnail (3).png"
import thumbnai3 from "@/assets/thumbnail (4).png"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Inter, Domine, Roboto } from 'next/font/google';
import prisma from '@/lib/prismaclient';
import { presignedUrl } from '@/app/actions/aws';


type Props = {};


const interFont = Inter({ subsets: ['latin'] });
const domineFont = Domine({ subsets: ['latin'] });
const robotoFont = Roboto({ subsets: ['latin'], weight: '400' });


const presets = {
  style1: {
    fontSize: 100,
    fontWeight: "bold",
    color: "rgba(255, 255, 255, 1)",
    opacity: 1,
  },
  style2: {
    fontSize: 100,
    fontWeight: "bold",
    color: "rgba(0, 0, 0, 1)",
    opacity: 1,
  },
  style3: {
    fontSize: 100,
    fontWeight: "bold",
    color: "rgba(255, 255, 255, 0.8)",
    opacity: 0.8,
  },
};

const ThumbNailCreator = ({children}:{children:React.ReactNode}) => {
  const [image, setImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState('style1');
  const [isProcessing, setIsProcessing] = useState(false);
  const [text, setText] = useState('POV');
  const [fontSize, setFontSize] = useState(100);
  const [color, setColor] = useState('rgba(255, 255, 255, 1)');
  const [font, setFont] = useState('Inter');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const removeBackgroundWithAPI = async (file: File) => {
    setIsProcessing(true);

    const formData = new FormData();
    formData.append('image_file', file);
    formData.append('size', 'auto');

    try {
      const response = await fetch('https://api.remove.bg/v1.0/removebg', {
        method: 'POST',
        headers: {
          'X-Api-Key': 'DqCTmSVDL1Ts2XVA6nJ15kLs',
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Background removal failed');
      }

      const blob = await response.blob();
      const processedUrl = URL.createObjectURL(blob);

      setProcessedImage(processedUrl);
    } catch (error) {
      console.log('Error removing background:', error);
      alert('Failed to remove background. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const drawImageOnCanvas = () => {
    if (!canvasRef.current || !processedImage || !image) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const backgroundImage = new Image();
    backgroundImage.src = image;
    backgroundImage.onload = () => {
      canvas.width = backgroundImage.width;
      canvas.height = backgroundImage.height;

      context?.drawImage(backgroundImage, 0, 0);

      let selectedPreset;

      switch (selectedStyle) {
        case 'style1':
          selectedPreset = presets.style1;
          break;
        case 'style2':
          selectedPreset = presets.style2;
          break;
        case 'style3':
          selectedPreset = presets.style3;
          break;
        default:
          selectedPreset = presets.style1; 
      }

      if (context) {
        context.save();
        context.textAlign = 'center';
        context.textBaseline = 'middle';

        let fontSize = selectedPreset.fontSize;
        let selectedFont = interFont.style.fontFamily; 
        switch (font) {
          case 'Domine':
            selectedFont = domineFont.style.fontFamily;
            break;
          case 'Roboto':
            selectedFont = robotoFont.style.fontFamily;
            break;
          default:
            selectedFont = interFont.style.fontFamily;
        }

        context.font = `${fontSize}px ${selectedFont}`;
        const textWidth = context.measureText(text).width;
        const targetWidth = canvas.width * 0.9;
        fontSize = (fontSize * targetWidth) / textWidth;
        context.font = `${fontSize}px ${selectedFont}`;

        context.fillStyle = color;
        context.globalAlpha = selectedPreset.opacity;

        const xText = canvas.width / 2;
        const yText = canvas.height / 2;

        context.fillText(text, xText, yText);
        context.restore();
      }

      const foregroundImg = new Image();
      foregroundImg.onload = () => {
        const imgWidth = foregroundImg.width;
        const imgHeight = foregroundImg.height;
        const x = (canvas.width - imgWidth) / 2;
        const y = (canvas.height - imgHeight) / 2;

        context?.drawImage(foregroundImg, x, y);
      };
      foregroundImg.src = processedImage;
    };
  };

  useEffect(() => {
    if (processedImage) {
      drawImageOnCanvas();
    }
  }, [processedImage, selectedStyle]);

  const processImage = (file: File) => {
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setImage(imageUrl);
        removeBackgroundWithAPI(file);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) processImage(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processImage(file);
  };


  const handleDownload = async () => {
    if (canvasRef.current) {
      canvasRef.current.toBlob(async (blob) => {
        if (!blob) return;

        try {
          const url = await presignedUrl();
          const response = await fetch(url, {
            method: 'PUT',
            headers: {
              'Content-Type': 'image/png',
            },
            body: blob,
          });

          if (response.ok) alert('Thumbnail uploaded successfully!');
          else throw new Error('Failed to upload thumbnail');
        } catch (error) {
          console.log('Upload Error:', error);
        }
      });
    }
  };





  return (
    <div className="max-w-screen-lg z-50 mt-5">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Want to create a thumbnail?
      </h1>
      <p className="text-lg text-gray-500 mt-1">Use one of the templates below</p>

      <div className="flex flex-col md:flex-row gap-x-2 mt-2 items-center justify-between rounded-md">
        <Style
          image={thumbnai1}
          selectedStyle={() => setSelectedStyle('style1')}
          isSelected={selectedStyle === 'style1'}
        />
        <Style
          image={thumbnai2}
          selectedStyle={() => setSelectedStyle('style2')}
          isSelected={selectedStyle === 'style2'}
        />
        <Style
          image={thumbnai3}
          selectedStyle={() => setSelectedStyle('style3')}
          isSelected={selectedStyle === 'style3'}
        />
      </div>

      {processedImage ? (
        <div className="flex md:flex-row flex-col border-black items-center gap-x-3 h-full justify-center mt-5">
          <canvas
            ref={canvasRef}
            className="w-full h-full object-cover rounded-lg"
          />

          <div className='w-full h-full mt-5'>
            <Card>
              <CardHeader>
                <CardTitle>Edit Thumbnail</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter your text"
                    className="p-2 border rounded-md"
                  />
                  <input
                    type="number"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    placeholder="Font size"
                    className="p-2 border rounded-md"
                  />
                  <select
                    value={font}
                    onChange={(e) => setFont(e.target.value)}
                    className="p-2 border rounded-md"
                  >
                    <option value="Inter">Inter</option>
                    <option value="Domine">Domine</option>
                    <option value="Roboto">Roboto</option>
                  </select>

                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="p-2 border rounded-md"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <div className='flex flex-row items-center justify-between gap-x-2 w-full'>
                  <Button onClick={drawImageOnCanvas}>Apply Changes</Button>
                  <Button onClick={handleDownload}>
                    Download
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>

      ) : (
        <div className="z-50 bg-white mt-5 p-6 rounded-lg shadow-lg min-w-screen">
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="border-2 border-dashed border-gray-300 px-28 py-10 max-w-full h-25 text-center cursor-pointer hover:border-gray-500 transition-colors"
          >
            <div className="flex flex-col items-center">
              <ImagePlus className="animate-bounce" />
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="file-input"
              />
              <label htmlFor="file-input" className="mt-4 cursor-pointer">
                Upload Image
              </label>
              <p className="text-gray-400">Drag and drop your image</p>
              <p className='text-sm text-gray-300'>Preferred size: 612 * 408</p>
            </div>
          </div>

          {isProcessing && (
            <div className="mt-4 item-center justify-center text-gray-500">
              <LoaderPinwheel className="animate-spin" />
            </div>
          )}
        </div>
      )}

      <div className="mt-6">
        {children}
      </div>

    </div>
  );
};

export default ThumbNailCreator;
