export interface Project {
    title: string;
    description: string;
    slug: string;
    cover: string;
    images: string[];
    buildFile?: string;
}

// Utility function to check if a string is a web URL
function isWebUrl(file: string): boolean {
    try {
        const url = new URL(file);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch {
        return false;
    }
}

// Function to get the file URL or path for a project
export function getFile(project: Project, file: string): string {
    if (isWebUrl(file))
        return file;

    return `projects/${project.slug}/${file}`;
}