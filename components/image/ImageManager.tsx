"use client";

import { useState, useEffect } from 'react';
import { list, remove, copy, getUrl, uploadData } from 'aws-amplify/storage';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, Trash2, FolderOutput, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { FileUploader } from '@aws-amplify/ui-react-storage';
import { ImageItem, ImageManagerProps } from './types';
import { getS3PublicUrl } from '@/utils/common';

export function ImageManager({ path = 'public/images/', onRefresh }: ImageManagerProps) {
    const [images, setImages] = useState<ImageItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState<File | undefined>();

    useEffect(() => {
        listImages();
    }, []);

    async function listImages() {
        try {
            setLoading(true);
            const response = await list({ path, options: { listAll: true } });
            const imageItems = await Promise.all(response.items.map(async (item) => {
                const urlResult = await getUrl({ path: item.path });
                return {
                    key: item.path,
                    url: urlResult.url.toString(),
                    lastModified: item.lastModified ? new Date(item.lastModified).toISOString() : new Date().toISOString(),
                    size: item.size ?? 0
                };
            }));
            setImages(imageItems);
            onRefresh?.();
        } catch (error) {
            console.error('Error listing images:', error);
            toast.error('Failed to list images');
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(key: string) {
        try {
            await remove({ path: key });
            toast.success('Image deleted successfully');
            await listImages();
        } catch (error) {
            console.error('Error deleting image:', error);
            toast.error('Failed to delete image');
        }
    }

    async function handleMove(key: string, newPath: string) {
        try {
            const result = await copy({
                source: { path: key },
                destination: { path: newPath }
            });
            if (result) {
                await remove({ path: key });
                toast.success('Image moved successfully');
                await listImages();
            }
        } catch (error) {
            console.error('Error moving image:', error);
            toast.error('Failed to move image');
        }
    }

    async function copyToClipboard(text: string) {
        try {
            if (navigator?.clipboard) {
                await navigator.clipboard.writeText(text);
            } else {
                // Fallback for browsers that don't support clipboard API
                const textarea = document.createElement('textarea');
                textarea.value = text;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
            }
            toast.success('Image URL copied to clipboard');
        } catch (error) {
            console.error('Failed to copy to clipboard:', error);
            toast.error('Failed to copy to clipboard');
        }
    }

    const handleChange = (event: any) => {
        setFile(event.target.files?.[0]);
    };

    const handleClick = () => {
        if (!file) {
            return;
        }
        uploadData({
            path: `${path}${file.name}`,
            data: file,
        });
    };

    return (
        <div className='space-y-4'>
            <div className='flex gap-4 items-center'>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button>Upload Image</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Upload Image</DialogTitle>
                        </DialogHeader>
                        {/* <FileUploader
                            acceptedFileTypes={['image/*']}
                            path={path}
                            maxFileCount={1}
                            isResumable
                        /> */}
                        <input type="file" onChange={handleChange} />
                        <button onClick={handleClick}>Upload</button>
                    </DialogContent>
                </Dialog>
                <Button onClick={() => listImages()}>Refresh</Button>
            </div>

            {loading ? (
                <div className='flex justify-center'>
                    <Loader2 className='animate-spin' />
                </div>
            ) : (
                <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4'>
                    {images.map((image) => (
                        <Card key={image.key} className='relative group'>
                            <CardContent className='p-2'>
                                <div className='aspect-square relative'>
                                    <img
                                        src={image.url}
                                        alt={image.key}
                                        className='object-cover w-full h-full rounded'
                                    />
                                    <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2'>
                                        <Button
                                            variant='default'
                                            size='icon'
                                            onClick={() => handleDelete(image.key)}
                                        >
                                            <Trash2 className='h-4 w-4' />
                                        </Button>
                                        <Button
                                            variant='secondary'
                                            size='icon'
                                            onClick={() => {
                                                const newPath = prompt('Enter new path:', image.key);
                                                if (newPath) handleMove(image.key, newPath);
                                            }}
                                        >
                                            <FolderOutput className='h-4 w-4' />
                                        </Button>
                                        <Button
                                            variant='default'
                                            size='icon'
                                            onClick={() => copyToClipboard(`${getS3PublicUrl(image.key)}`)}>
                                            <Copy className='w-4 h-4' />
                                        </Button>
                                    </div>
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
