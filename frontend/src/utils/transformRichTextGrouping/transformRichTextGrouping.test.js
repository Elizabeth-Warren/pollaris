import transformRichTextGrouping from '.';

const richTextFixture = [
  { nodeType: 'heading-1' },
  { nodeType: 'paragraph' },
  { nodeType: 'heading-1' },
  { nodeType: 'ordered-list' },
  { nodeType: 'heading-1' },
  { nodeType: 'unordered-list' },
];

describe('transformRichTextGrouping', () => {
  it('returns interpolated string with location name prefix', () => {
    expect(
      transformRichTextGrouping(
        'heading-1',
        richTextFixture,
      ),
    ).toStrictEqual({
      headings: [{ nodeType: 'heading-1' }, { nodeType: 'heading-1' }, { nodeType: 'heading-1' }],
      content: [
        [{ nodeType: 'paragraph' }],
        [{ nodeType: 'ordered-list' }],
        [{ nodeType: 'unordered-list' }],
      ],
    });
  });
});
