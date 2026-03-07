export default {
    name: 'siteSettings',
    title: 'Site Settings',
    type: 'document',
    fields: [
        {
            name: 'logoText',
            title: 'Logo Text',
            type: 'string',
        },
        {
            name: 'email',
            title: 'Email Address',
            type: 'string',
        },
        {
            name: 'whatsapp',
            title: 'WhatsApp Number',
            type: 'string',
            description: 'Format: 94702096510'
        },
        {
            name: 'linkedin',
            title: 'LinkedIn URL',
            type: 'url',
        }
    ]
}
