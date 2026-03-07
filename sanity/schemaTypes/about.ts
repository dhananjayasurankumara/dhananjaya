export default {
    name: 'about',
    title: 'About Section',
    type: 'document',
    fields: [
        {
            name: 'title',
            title: 'Title',
            type: 'string',
        },
        {
            name: 'paragraphs',
            title: 'Paragraphs',
            type: 'array',
            of: [{ type: 'text' }]
        },
        {
            name: 'backgroundImage',
            title: 'Background Image',
            type: 'image',
            options: { hotspot: true }
        }
    ]
}
