export default {
    name: 'hero',
    title: 'Hero Section',
    type: 'document',
    fields: [
        {
            name: 'label',
            title: 'Label',
            type: 'string',
            description: 'Small text above the title (e.g., Creative Developer)'
        },
        {
            name: 'titleLine1',
            title: 'Title Line 1',
            type: 'string',
        },
        {
            name: 'titleLine2',
            title: 'Title Line 2',
            type: 'string',
        },
        {
            name: 'backgroundImage',
            title: 'Background Image',
            type: 'image',
            options: { hotspot: true }
        }
    ]
}
