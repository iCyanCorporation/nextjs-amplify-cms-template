"use client";

import { useState, useEffect } from 'react';
import { list, getUrl } from 'aws-amplify/storage';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { ImageItem, ImagePickerProps } from './types';
import { getS3PublicUrl } from '@/lib/common';

export function ImagePicker({ onSelect, onClose }: ImagePickerProps) {
    const [images, setImages] = useState<ImageItem[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        listImages();
    }, []);

    async function listImages() {
        try {
            setLoading(true);
            const response = await list({ path: 'public/images/', options: { listAll: true } });
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
        <div className='space-y-4 w-full '>
            <div className='flex justify-between items-center'>
                <h2 className='text-lg font-semibold'>Select an Image</h2>
                <Button className='rounded-full hover:opacity-80' variant='destructive' onClick={() => listImages()}>
                    <RefreshCw className='h-4 w-4' />
                </Button>
            </div>

            {loading ? (
                <div className='flex justify-center'>
                    <Loader2 className='animate-spin' />
                </div>
            ) : (
                <div className='p-4 w-full max-h-[80vh] overflow-y-auto grid grid-cols-2 md:grid-cols-6 lg:grid-cols-8 gap-4'>
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
                                        className='object-cover w-full h-full rounded  aspect-square'
                                    />
                                </div>
                                {/* <div className='mt-2 text-sm truncate'>{image.key}</div> */}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
