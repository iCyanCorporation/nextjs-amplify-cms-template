
export interface Profile {
    name: string;
    title: string;
    location: string;
    image: string;
    bio: string;
    socialLinks: {
        name: string;
        href: string;
        icon: any;
    }[];
    schedule: {
        isActive: boolean;
        status: string;
    };
}

export interface WorkExperience {
    company: string;
    position: string;
    period: string;
    achievements: string[];
}

export interface Education {
    institution: string;
    degree: string;
    period: string;
    description: string;
}

export interface OtherExperience {
    title: string;
    period: string;
    description: string;
}

export interface Skills {
    [key: string]: string[] | undefined;
}

export interface AboutData {
    profile: Profile;
    workExperience: WorkExperience[];
    sideProjects: WorkExperience[];
    education: Education[];
    otherExperience: OtherExperience[];
    skills: Skills;
}