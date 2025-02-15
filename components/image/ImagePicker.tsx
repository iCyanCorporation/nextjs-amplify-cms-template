"use client";

import { useState, useEffect } from 'react';
import { list, getUrl } from 'aws-amplify/storage';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { ImageItem, ImagePickerProps } from './types';
import { getS3PublicUrl } from '@/utils/common';

export function ImagePicker({ onSelect, onClose }: ImagePickerProps) {
    const [images, setImages] = useState<ImageItem[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        listImages();
    }, []);

    async function listImages() {
        try {
            setLoading(true);
            const response = await list({ path: 'public/images/' });
            const imageItems = await Promise.all(response.items.map(async (item) => {
                return {
                    key: item.path,
                    url: getS3PublicUrl(item.path),
                    lastModified: item.lastModified ? new Date(item.lastModified).toISOString() : new Date().toISOString(),
                    size: item.size ?? 0
                };
            }));
            setImages(imageItems);
        } catch (error) {
            console.error('Error listing images:', error);
            toast.error('Failed to list images');
        } finally {
            setLoading(false);
        }
    }

    function handleSelect(image: ImageItem) {
        onSelect?.(image.url);
        onClose?.();
    }

    return (
        <div className='space-y-4'>
            <div className='flex justify-between items-center'>
                <h2 className='text-lg font-semibold'>Select an Image</h2>
                <Button onClick={() => listImages()}>Refresh</Button>
            </div>

            {loading ? (
                <div className='flex justify-center'>
                    <Loader2 className='animate-spin' />
                </div>
            ) : (
                <div className='grid grid-cols-2 md:grid-cols-6 lg:grid-cols-8 gap-4'>
                    {images.map((image) => (
                        <Card
                            key={image.key}
                            className='relative group cursor-pointer hover:ring-2 hover:ring-primary'
                            onClick={() => handleSelect(image)}
                        >
                            <CardContent className='p-2'>
                                <div className='aspect-square relative'>
                                    <img
                                        src={image.url}
                                        alt={image.key}
                                        className='object-cover w-full h-full rounded'
                                    />
                                </div>
                                <div className='mt-2 text-sm truncate'>{image.key}</div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
