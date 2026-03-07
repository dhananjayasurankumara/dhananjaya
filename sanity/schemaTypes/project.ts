export default {
    name: 'project',
    title: 'Projects',
    type: 'document',
    fields: [
        {
            name: 'title',
            title: 'Title',
            type: 'string',
        },
        {
            name: 'category',
            title: 'Category',
            type: 'string',
        },
        {
            name: 'image',
            title: 'Project Image',
            type: 'image',
            options: { hotspot: true }
        },
        {
            name: 'link',
            title: 'Project Link',
            type: 'url',
        }
    ]
}
