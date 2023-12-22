export const baseURLAPI = (url = '') => {
    url = url.replace(/^[/]/g, '');
    const baseURL = 'https://api-v1-mkp.vercel.app/';
    return baseURL + url;
}