export interface Author {
    name: string;
}

export interface BlogPost {
    id: string;
    title: string;
    content: string;
    category: string;
    readTime: string;
    author: Author;
    date: string;
    onClick?: () => void;
}

export interface HomePageData {
    intro: {
        title: {
            sequences: [string, number][];
            speed: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 15 | 20 | 25 | 30 | 35 | 40 | 45 | 50 | 55 | 60 | 65 | 70 | 75 | 80 | 85 | 90 | 95 | 99;
        };
        description: string;
        profileImage: string;
        aboutButton: string;
    };
    selection: {
        title: string;
        items: Array<{
            title: string;
            description: string;
            imgUrl?: string;
            // height?: string;
        }>;
    };
    gallery: {
        title: string;
        items: Array<{
            title: string;
            imgUrl?: string;
        }>;
    };
    blog: {
        title: string;
        posts?: BlogPost[];
        noPosts: {
            title: string;
            description: string;
        };
    };
}