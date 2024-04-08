const axios = require('axios');
const { fetchMemeImages } = require('./main');

jest.mock('axios');

describe('fetchMemeImages', () => {
    it('fetches meme images successfully', async () => {
        const responseData = {
            data: {
                data: {
                    memes: [
                        { id: '1', name: 'Meme 1', url: 'https://example.com/meme1.jpg' },
                        { id: '2', name: 'Meme 2', url: 'https://example.com/meme2.jpg' },
                    ]
                }
            }
        };

        axios.get.mockResolvedValue(responseData);

        const memeImages = await fetchMemeImages();
        expect(memeImages).toEqual(responseData.data.data.memes);
    });

    it('handles error while fetching meme images', async () => {
        const errorMessage = 'Error fetching meme images';
        axios.get.mockRejectedValue(new Error(errorMessage));

        const memeImages = await fetchMemeImages();
        expect(memeImages).toEqual([]);
    });
});
