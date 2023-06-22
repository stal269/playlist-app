import { PopulateIdPipe } from './populate-id.pipe';

describe('PopulateIdPipe', () => {
    it('should extract the id from the url when it exists', () => {
        const pipe = new PopulateIdPipe();
        const url = 'https://www.youtube.com/watch?v=o62i5YUFRjc&list=PLyesBWGcaGGZp4O1auu5jkwAc5QmdlLZD&index=15';

        const populatedSong = pipe.transform({ url }, {
            type: 'body'
        });

        expect(populatedSong.url).toEqual(url);
        expect(populatedSong.id).toEqual('o62i5YUFRjc');
    });

    it('should throw an exception when id is missing in url', () => {
        const pipe = new PopulateIdPipe();
        const url = 'https://www.youtube.co';

        expect(() => {
            pipe.transform({ url }, {
                type: 'body'
            });
        }).toThrow();
    });
});
