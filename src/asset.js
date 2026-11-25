// Public files must follow the repository subdirectory on GitHub Pages.
export const asset = path => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
